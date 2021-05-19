import { buildFullPath, buildURL } from '../src/util/url';

describe('test url function', () => {
    test('basic usage with buildURL', () => {
        expect(buildURL('http://www.test.com')).toEqual('http://www.test.com');
        expect(
            buildURL('http://www.test.com', {
                a: 1,
                b: [1, 2],
                c: {
                    d: 1,
                },
            }),
        ).toEqual('http://www.test.com?a=1&b[]=1&b[]=2&c=%7B%22d%22:1%7D');
    });

    test('buildUrl with paramsSerializer', () => {
        let url = buildURL(
            'http://www.test.com',
            {
                a: 1,
                b: 2,
            },
            () => 'test-params',
        );

        expect(url).toEqual('http://www.test.com?test-params');
    });

    test('test url has hash with buildURL', () => {
        expect(
            buildURL('http://www.test.com#12312', {
                a: 1,
            }),
        ).toEqual('http://www.test.com?a=1');
    });

    test('test buildFullPath', () => {
        expect(buildFullPath('http://www.abc.com', 'users')).toEqual(
            'http://www.abc.com/users',
        );
        expect(buildFullPath('http://www.abc.com/', 'users')).toEqual(
            'http://www.abc.com/users',
        );
        expect(buildFullPath('http://www.abc.com/', '/users')).toEqual(
            'http://www.abc.com/users',
        );
        expect(buildFullPath('http://www.abc.com', '/users')).toEqual(
            'http://www.abc.com/users',
        );
    });

    test('buildFullPath when get abs url', () => {
        expect(buildFullPath('http://www.abc.com', 'http://users')).toEqual(
            'http://users',
        );
    });
});
