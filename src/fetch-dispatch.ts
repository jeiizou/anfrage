import { mergeOption, timeoutHandle } from './util/utils';
import * as Url from './util/url';
import { getResponse } from './util/response';

async function injectRequestHooks(
    requestContext: RequestContext,
    sendOption: RequestParams,
) {
    let answer = sendOption;
    let requestTransformer = requestContext.requestTransformer;
    for await (const requestFunction of requestTransformer || []) {
        answer = requestFunction(requestContext, sendOption);
    }
    return answer;
}

async function injectRespinseHooks(
    requestContext: RequestContext,
    response: localResponse,
) {
    let answer = response;
    let responseTransformer = requestContext.responseTransformer;
    for await (const requestFunction of responseTransformer || []) {
        answer = requestFunction(response);
    }
    return answer;
}

export async function fetchDispath(
    option: Partial<RequestParams>,
    requestContext: RequestContext,
) {
    let sendOption = mergeOption(requestContext.default, option);

    async function buildResponse(fetchResult: Response) {
        return {
            data: await getResponse(fetchResult, sendOption.responseType),
            status: fetchResult.status,
            statusText: fetchResult.statusText,
            headers: fetchResult.headers,
            config: sendOption,
            response: fetchResult,
        };
    }

    try {
        let response: localResponse;
        // requestTransformer
        sendOption = await injectRequestHooks(requestContext, sendOption);
        // 耦合
        const fetchConfig = {
            ...sendOption,
            url: undefined,
            responseType: undefined,
            validateStatus: undefined,
            timeout: undefined,
            timeoutErrorMessage: undefined,
        } as RequestInit;

        fetchConfig.method = fetchConfig.method?.toLocaleUpperCase() || 'GET';

        let fullPath = Url.buildFullPath(
            requestContext.domain || '',
            sendOption.url || '',
        );

        if (['GET', 'HEAD'].includes(fetchConfig.method)) {
            fullPath = Url.buildURL(fullPath, fetchConfig.body);
            delete fetchConfig.body;
        }

        let fetchResult: Response;
        // handle the timeout logic
        if (sendOption.timeout && sendOption.timeout > 0) {
            let timeKey = Symbol(sendOption.timeoutErrorMessage);
            let value = await Promise.race([
                timeoutHandle(sendOption.timeout, timeKey),
                fetch(fullPath, fetchConfig),
            ]);
            if (value === timeKey) {
                throw Error(sendOption.timeoutErrorMessage);
            }

            fetchResult = value as Response;
        } else {
            fetchResult = await fetch(fullPath, fetchConfig);
        }

        if (sendOption.validateStatus(fetchResult.status)) {
            response = await buildResponse(fetchResult);
        } else {
            throw Error(fetchResult.statusText);
        }

        // requestTransformer
        response = await injectRespinseHooks(requestContext, response);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
}
