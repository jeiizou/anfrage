import { createRequest } from './request';
export { createRequest } from './request';

// export create function
// create instance with default config
export const instance = createRequest();

function Anfrage(config: Partial<RequestParams>) {
    return instance.request(config);
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

export default Anfrage;
