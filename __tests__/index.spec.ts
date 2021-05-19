import Request from '../src/index';
import fetchMock from 'fetch-mock-jest';

function sleep(time: number) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}

describe('global test', () => {
    const users = [
        {
            name: 'ming',
            age: 20,
        },
        {
            name: 'wang',
            age: 12,
        },
    ];
    fetchMock.get('http://www.test.com/users', users);

    test('base request', async () => {
        let request = new Request({
            domain: 'http://www.test.com',
        });

        expect(
            (
                await request.request({
                    url: 'users',
                    method: 'GET',
                })
            ).data,
        ).toEqual(users);

        expect(fetchMock).toHaveLastFetched('http://www.test.com/users', 'get');
    });

    test('request cache', async () => {
        let request = new Request({
            domain: 'http://www.test.com',
            cacheLimit: 2,
            cacheTime: 500,
        });

        let ans1 = await request.request({
            url: 'users',
            method: 'GET',
        });
        let ans2 = await request.request({
            url: 'users',
            method: 'GET',
        });

        expect(ans1).toBe(ans2);
        expect(fetchMock).toBeCalledTimes(2);

        await sleep(500);
        let ans3 = await request.request({
            url: 'users',
            method: 'GET',
        });

        expect(ans3).not.toBe(ans2);
        expect(fetchMock).toBeCalledTimes(3);
    });
});
