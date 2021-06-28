# @chaos-kit/anfrage

a lit fetch library

```js
import { Anfrage } from '@chaos-kit/anfrage';

Anfrage.get('/demos')
    .then(data => {
        console.log(data)
    })
```

## features

- [x] request-cache-controll (lru)
- [x] timeout
- [x] before/after hooks
- [x] async-pool

## usage

1. basic:

```ts
import { Anfrage, createAnfrage } from '@chaos-kit/anfrage';

// basic
let response1 = await Anfrage({
    url: 'www.abc.com/abc/test'
});


// use createAnfrage
let instance = createAnfrage({
    domain: 'www.abc.com'
});

let response2 = await instance.request({
    url: '/abc/test',
    method: 'GET',
})


// fast method
let response3 = await Anfrage.get('www.abc.com/test', {
    // ...config
})
```

2. cache controller

```ts
let instance = createAnfrage({
    domain: 'www.abc.com',
    cacheLimit: 20,
    cacheTime: 500,
});


let data1 = instance.request({
    url: '/abc/test',
    method: 'GET'
});

let data2 = instance.request({
    url: '/abc/test',
    method: 'GET'
});

data1 === data2 // true
```

3. abort request

```ts
let controller = new AbortController();
let signal = controller.signal;

let instance = createAnfrage({
    domain: 'www.abc.com',
    cacheLimit: 20,
    cacheTime: 500,
});


let data1 = instance.request({
    url: '/abc/test',
    method: 'GET',
    signal,
});


controller.abort(); // get AbortError()
```

4. async-limit

```ts
let instance = createAnfrage({
    domain: 'www.abc.com',
    asyncLimit: 2,
});

let A = await instance.requet({
    url: 'a'
})
let B = await instance.requet({
    url: 'b'
})
let C = await instance.requet({
    url: 'c'
})
// A, B will request immediatly, but C will be pending util A or B had finished
```


