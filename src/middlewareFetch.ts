import 'isomorphic-fetch'
import { senserizeObj, timeoutHandle } from './utils'

export default async function fetchMiddleware (ctx: any, next: any) {
	const { 
		url, 
		params, 
		timeout = 15000,
		giveupRequest, 
		requestInit, 
		responseType = 'json' 
	} = ctx.req

	const { useCache } = ctx.res

	if (giveupRequest) {
		return Promise.reject()
	}

	if (useCache) {
		return await next()
	}
	
	const p = typeof params === 'string' ? params : senserizeObj(params || {})
	const reqInstance = new Request(`${url}${p ? '?' + p : ''}`, requestInit)
	
	ctx.request = reqInstance

	const fetchHandle = () => fetch(reqInstance)
		.then(response => {
			ctx.response = response

			if (!response.ok) {
				ctx.res.error = response
			}
			else {
				if (responseType === 'stream') {
					return Promise.resolve(response.body)
				}
				else {
					return (response as any)[responseType || 'text']()
				}
			}
		})
		.catch(error => {
			ctx.res.error = error
		})
	
	const [isTimeout, result] = await Promise.all([
		timeoutHandle(timeout), 
		fetchHandle
	])
	
	if (isTimeout) {
		ctx.res.error = new Error(isTimeout as string)
	}
	else {
		ctx.res.data = result

	}

	await next()
}