export const defaultHeaders = new Headers();
defaultHeaders.append('Accept', 'application/json, text/plain, */*');

export const defaultFetchConfig: RequestInit = {
    method: 'GET',
    mode: 'cors',
    credentials: 'omit',
    cache: 'default',
    redirect: 'follow',
    headers: defaultHeaders,
};

export const defaultRequestParams: RequestParams = {
    url: '',
    responseType: 'json',
    timeout: 0,
    timeoutErrorMessage: 'request timeout',
    validateStatus: function validateStatus(status: number) {
        return status >= 200 && status < 300;
    },
    ...defaultFetchConfig,
};

export const defaultRequestContext: RequestContext = {
    domain: '',
    cacheLimit: 0,
    cacheTime: 0,
    retryLimit: 0,
    asyncLimit: 0,
    default: defaultRequestParams,
};
