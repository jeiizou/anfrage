import { version, name } from '../../package.json';

export function errorMsg(msg: string) {
    return `[${name.split('/')[1]}_${version}]: ${msg}`;
}
