import LRU from '@chaos-kit/lru';
import { errorMsg } from './util/error';

export default class CacheController<T> {
    #lru: LRU<
        string,
        {
            data: T;
            time: number;
        }
    >;
    constructor(private cacheTime: number, cacheLimit: number) {
        if (this.cacheTime > 0 && cacheLimit > 0) {
            this.#lru = new LRU(cacheLimit);
        } else {
            throw Error(
                errorMsg('cache time and cache limit should greater than zero'),
            );
        }
    }

    isEffective(key: string) {
        let now = Date.now();
        let result = this.get(key);
        return result && now - result.time <= this.cacheTime;
    }

    get(key: string) {
        return this.#lru.get(key);
    }

    set(key: string, response: T): void {
        let now = Date.now();
        this.#lru.set(key, {
            data: response,
            time: now,
        });
    }
}
