import { cloneDeep, merge } from 'lodash';

export function mergeOption<T>(object: T, source: Partial<T>): T {
    let targetObject = cloneDeep(object);
    return merge(targetObject, source);
}
