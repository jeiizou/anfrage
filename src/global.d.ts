type KVStringObject = {
    [keyname: string]: string;
};

type paramsSerializerFunction = (params: KVStringObject) => string;

type RequestContext = {
    // 主域
    domain: string;
    // 最多缓存的请求数量
    cacheLimit: number;
    // 最长缓存失效时间
    cacheTime: number;

    // 最多重试次数
    retryLimit: number;
    // 最大并发数量
    asyncLimit: number;

    // 默认全局请求参数
    default: RequestParams;

    // 请求前置钩子
    requestTransformer?: ((
        config: RequestContext,
        param: RequestParams,
    ) => RequestParams)[];
    // 请求后置钩子
    responseTransformer?: ((response: localResponse) => localResponse)[];
};

interface RequestParams extends RequestInit {
    // 请求的接口地址
    url: string;
    // 状态校验函数
    validateStatus: (status: number) => boolean;
    // 返回数据类型
    responseType: string;
    // 超时时间
    timeout?: number;
    // 超时提示文本
    timeoutErrorMessage?: string;
    // // 下载进度函数
    // onDownloadProgress?: (
    //     this: XMLHttpRequest,
    //     ev: ProgressEvent<XMLHttpRequestEventTarget>,
    // ) => any;
    // // 上传进度函数
    // onUploadProgress?: (
    //     this: XMLHttpRequestUpload,
    //     ev: ProgressEvent<XMLHttpRequestEventTarget>,
    // ) => any;
}

type localResponse = {
    // 返回数据
    data: any;
    // 请求状态码
    status: number;
    // 请求文字
    statusText: string;
    // 响应头
    headers: Headers;
    // 请求配置
    config: RequestParams;
    // response
    response: Response;
};
