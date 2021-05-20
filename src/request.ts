import * as defaultConfig from './default';
import { mergeOption } from './util/utils';
import { fetchDispath } from './fetch-dispatch';
import CacheController from './cache-controller';

export class Request {
    #cache: CacheController<localResponse> | undefined;
    #requestContext: RequestContext;

    constructor(
        params: Partial<RequestContext>,
        cacheController?: CacheController<localResponse>,
    ) {
        this.#requestContext = mergeOption(
            defaultConfig.defaultRequestContext,
            params,
        );
        this.#cache = cacheController;
    }

    async request(option: Partial<RequestParams>) {
        let response: localResponse;
        // enable cache
        if (this.#cache) {
            let mapKey = JSON.stringify(option);
            // is effective?
            if (this.#cache.isEffective(mapKey)) {
                return this.#cache.get(mapKey)?.data as localResponse;
            } else {
                // update response data
                response = await fetchDispath(option, this.#requestContext);
                // cache the response
                this.#cache.set(mapKey, response);
                return response;
            }
        } else {
            // no cache, send fetch
            return await fetchDispath(option, this.#requestContext);
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
    return new Request(...args);
}
