import LRU from '@chaos-kit/lru';
import * as Url from './util/url';
import * as defaultConfig from './default';
import { mergeOption } from './util/utils';
import { getResponse } from './util/response';

export default class Request {
    lruCache:
        | LRU<
              string,
              {
                  data: localResponse;
                  time: number;
              }
          >
        | undefined;

    requestContext: RequestContext;

    constructor(params: Partial<RequestContext> = {}) {
        this.requestContext = mergeOption(
            defaultConfig.defaultRequestContext,
            params,
        );
        /**
         * 初始化请求缓存控制
         * TODO: 后续提取依赖, 使用依赖注入的模式抽离逻辑耦合
         */
        if (
            this.requestContext.cacheTime > 0 &&
            this.requestContext.cacheLimit > 0
        ) {
            this.lruCache = new LRU(this.requestContext.cacheLimit);
        }
    }

    async request(option: Partial<RequestParams>) {
        let response: localResponse;
        const { cacheTime } = this.requestContext;
        if (cacheTime && cacheTime > 0 && this.lruCache) {
            // 需要进行请求缓存逻辑
            let now = Date.now();
            let mapKey = JSON.stringify(option);
            // 存在对应的缓存内容
            let lastResult = this.lruCache.get(mapKey);
            if (lastResult && now - lastResult.time <= cacheTime) {
                return lastResult.data;
            } else {
                // 更新接口缓存数据
                response = await this.send(option);
                // 缓存数据内容, 如果发生异常则不缓存
                this.lruCache.set(mapKey, {
                    data: response,
                    time: now,
                });
                return response;
            }
        } else {
            // 不需要进行缓存逻辑, 直接发送请求即可
            return await this.send(option);
        }
    }

    private async send(option: Partial<RequestParams>) {
        let sendOption = mergeOption(this.requestContext.default, option);

        try {
            let response: localResponse;
            // requestTransformer
            let requestTransformer = this.requestContext.requestTransformer;
            for await (const requestFunction of requestTransformer || []) {
                sendOption = requestFunction(this.requestContext, sendOption);
            }

            const fetchConfig = {
                ...sendOption,
                url: undefined,
                responseType: undefined,
                validateStatus: undefined,
            } as RequestInit;

            fetchConfig.method =
                fetchConfig.method?.toLocaleUpperCase() || 'GET';

            let fullPath = Url.buildFullPath(
                this.requestContext.domain || '',
                sendOption.url || '',
            );

            if (['GET', 'HEAD'].includes(fetchConfig.method)) {
                fullPath = Url.buildURL(fullPath, fetchConfig.body);
                delete fetchConfig.body;
            }

            const fetchResult = await fetch(fullPath, fetchConfig);
            if (sendOption.validateStatus(fetchResult.status)) {
                // TODO: 抽象 build Response 方法
                response = {
                    data: await getResponse(
                        fetchResult,
                        sendOption.responseType,
                    ),
                    status: fetchResult.status,
                    statusText: fetchResult.statusText,
                    headers: fetchResult.headers,
                    config: sendOption,
                    response: fetchResult,
                };
            } else {
                throw Error(fetchResult.statusText);
            }

            // requestTransformer
            let responseTransformer = this.requestContext.responseTransformer;
            for await (const requestFunction of responseTransformer || []) {
                response = requestFunction(response);
            }

            return response;
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
