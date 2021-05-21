import AsyncPool from '../src/async-pool';
import { sleep } from './utils/sleep';

describe('async-pool', () => {
    const generatorTask = (time: number) => {
        return function task(): Promise<number> {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(time);
                }, time);
            });
        };
    };

    test('basic', async () => {
        let asyncpool = new AsyncPool<number>(2);
        let ans: any[] = [];
        function pushValue(value: number) {
            ans.push(value);
        }
        asyncpool.pushTask(generatorTask(300)).then(pushValue);
        asyncpool.pushTask(generatorTask(1000)).then(pushValue);
        asyncpool.pushTask(generatorTask(500)).then(pushValue);
        asyncpool.pushTask(generatorTask(400)).then(pushValue);

        await sleep(2000);
        expect(ans).toEqual([300, 500, 1000, 400]);
    });
});
