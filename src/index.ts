import { createRequest } from './request';

// create instance with default config
export const instance = createRequest();
// export create function
export const createAnfrage = createRequest;

/**
 * Anfrage Function 
 * @param config 
 * @param context 
 * @returns response
 */
export function Anfrage(
    config: Partial<RequestParams>,
    context?: Partial<RequestContext>,
) {
    if (context) {
        let newInstance = createAnfrage(context);
        return newInstance.request(config);
    } else {
        return instance.request(config);
    }
}

[
    'get',
    'post',
    'head',
    'options',
    'put',
    'delete',
    'patch',
    'connect',
    'trace',
].forEach(method => {
    Anfrage.prototype[method] = function (
        url: string,
        config: Partial<RequestParams> = {},
    ) {
        return instance.request({
            url,
            method,
            ...config,
        });
    };
});
