import * as cache from './cache'

export default async function cacheMiddleware(ctx: any, next: any) {
	const { url, method, params, cacheOptions} = ctx.req
	const key = url + '?' + params
	const fetchMethod = (method as string).toLowerCase()

	if (fetchMethod === 'get') {
		const resCache = cache.getRequestCache(key)

		if (resCache) {
			if (resCache.status === 'pending') {
				ctx.req.giveupRequest = true
			}
			else {
				ctx.res.data = resCache.value
				ctx.res.useCache = true
			}
		}
		else if (!resCache && cacheOptions.cache) {
			cache.pendingRequestCache(key, cacheOptions?.expiredAge)
		}
	}

	await next()

	const { data } = ctx.res
	
	if (fetchMethod === 'get' && cacheOptions.cache) {
		ctx.req.giveupRequest = false
		ctx.res.useCache = false
		cache.setRequestCache(key, data)
	}
}