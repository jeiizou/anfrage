import { cloneDeep, merge } from 'lodash';

export function mergeOption<T>(object: T, source: Partial<T>): T {
    let targetObject = cloneDeep(object);
    return merge(targetObject, source);
}

export function timeoutHandle(time: number, value: any) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(value);
        }, time);
    });
}
