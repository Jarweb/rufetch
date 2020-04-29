### intro

a lightweight fetch lib with middleware inspired by koa



### quick start

```
yarn add @jarzzzi/rufetch
```


### example

```javascript
const http = new Rufetch({
  baseURL: 'https://github.com/api',
})

const getUser = (name) => {
  return http.get(`/user/${name}`)
}

const getReps = (name, page) => {
  return http.get(`/user/${name}`, {params: {page}})
}

const createReps = (name, data) => {
  return http.post(`/user/${name}`, {data})
}
```

### middleware
- built in middleware
  - cache
  - fetch

- error middleware
```javascript
http.use(async (ctx: any, next: any) => {
  await next()
  const {error} = ctx.res

  if (error?.status >= 400 && error?.status < 500) {
    console.error('client error')
  }
  if (error?.status >= 500) {
    console.error('server error')
  }
  if (error === 'fetch timeout') {
    console.error('fetch timeout')
  }
})
```
- token middleware
```javascript
http.use(async (ctx: any, next: any) => {
  const token = await getToken()
  ctx.req.requestInit.setHeaders(token, token)
  await next()
})
```

### api
- options
  - baseURL
  - timeout: default 15000
  - params: url search params
  - data: body alias
  - responseType: default json, arrayBuffer, blob, json, text, formData, stream...
  - cacheOptions
    - cache: boolean
    - expiredAge: default 5000
  - body
  - cache
  - credentials
  - headers
  - integrity
  - keepalive
  - method
  - mode
  - redirect
  - referrer
  - referrerPolicy
  - signal
  - window
- new (options)
- instance.get
- instance.post
- instance.put
- instance.delete
- instance.head
- instance.use
  - add middleware
  - ctx
    - req
    - request
    - res
    - response
