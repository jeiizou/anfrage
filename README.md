# chaos-fetch

## features

- [x] request-cache-controll (lru): 请求缓存控制
- [ ] timeout: fetch 超时控制
- [ ] retry: 错误重试
- [ ] async-pool: 并发限制
- [x] 前置/后置 请求钩子
- [ ] abort 取消请求
- [ ] 增强报错信息

## usage

```ts
import Anfrage from '@chaos-kit/anfrage';

let instance = new Anfrage({
    domain: 'http://www.test.com',
});

await instance.Anfrage({
    url: 'users',
    method: 'GET',
})
```