import * as defaultConfig from './default';
import { mergeOption } from './util/utils';
import { fetchDispath } from './fetch-dispatch';
import CacheController from './cache-controller';
import AsyncPool from './async-pool';
import { errorMsg } from './util/error';

export class Request {
    #cache: CacheController<localResponse> | undefined;
    #asyncpool: AsyncPool<localResponse> | undefined;
    #requestContext: RequestContext;

    constructor(
        params: Partial<RequestContext>,
        cacheController?: CacheController<localResponse>,
        asyncPool?: AsyncPool<localResponse>,
    ) {
        this.#requestContext = mergeOption(
            defaultConfig.defaultRequestContext,
            params,
        );
        this.#cache = cacheController;
        this.#asyncpool = asyncPool;
    }

    async request(option: Partial<RequestParams>) {
        const AsyncSend = () => {
            if (this.#asyncpool) {
                return this.#asyncpool.pushTask(() =>
                    fetchDispath(option, this.#requestContext),
                );
            } else {
                return fetchDispath(option, this.#requestContext);
            }
        };

        try {
            let response: localResponse;
            // enable cache
            if (this.#cache) {
                let mapKey = JSON.stringify(option);
                // is effective?
                if (this.#cache.isEffective(mapKey)) {
                    return this.#cache.get(mapKey)?.data as localResponse;
                } else {
                    // update response data
                    response = await AsyncSend();
                    // cache the response
                    this.#cache.set(mapKey, response);
                    return response;
                }
            } else {
                // no cache, send fetch
                return await AsyncSend();
            }
        } catch (error) {
            console.error(errorMsg(error), error);
            throw error;
        }
    }
}

export function createRequest(params: Partial<RequestContext> = {}) {
    let args: ConstructorParameters<typeof Request> = [params];
    // init CacheController
    if (
        params.cacheTime &&
        params.cacheTime > 0 &&
        params.cacheLimit &&
        params.cacheLimit > 0
    ) {
        const lruCache = new CacheController<localResponse>(
            params.cacheTime,
            params.cacheLimit,
        );
        args.push(lruCache);
    }

    // init AsyncPool
    if (params.asyncLimit && params.asyncLimit > 0) {
        const asyncPool = new AsyncPool<localResponse>(params.asyncLimit);
        args.push(asyncPool);
    }

    return new Request(...args);
}
