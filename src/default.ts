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
    config: defaultFetchConfig,
    responseType: 'json',
    validateStatus: function validateStatus(status: number) {
        return status >= 200 && status < 300;
    },
};

export const defaultRequestContext: RequestContext = {
    domain: '',
    timeout: 0,
    cacheLimit: 0,
    cacheTime: 0,
    retryLimit: 0,
    asyncLimit: 0,
    default: defaultRequestParams,
};
