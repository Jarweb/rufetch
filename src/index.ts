import compose from './compose'
import middlewareFetch from './middlewareFetch'
import middlewareCache from './middlewareCache'

interface RufetchOption {
	baseURL?: string,
	timeout?: number,
	// like get...
	params?: RequestInit['body'], 
	// like post
	data?: RequestInit['body'],
	// arrayBuffer, blob, json, text, formData, stream..., default json
	responseType?: string,
	// built in cache, not native request cache
	cacheOptions?: {
		cache: boolean,
		expiredAge?: number,
	},
	// native request config
	body?: RequestInit['body'],
	cache?: RequestInit['cache'],
	credentials?: RequestInit['credentials'],
	headers?: RequestInit['headers'],
	integrity?: RequestInit['integrity'],
	keepalive?: RequestInit['keepalive'],
	method?: RequestInit['method'],
	mode?: RequestInit['mode'],
	redirect?: RequestInit['redirect'],
	referrer?: RequestInit['referrer'],
	referrerPolicy?: RequestInit['referrerPolicy'],
	signal?: RequestInit['signal'],
	window?: RequestInit['window'],
}

export default class Rufetch {
	private options: RufetchOption = {}
	private middlewares: Function[] = []

	constructor(options: RufetchOption) {
		this.options = options
	}

	use = (middleware: any) => {
		this.middlewares.push(middleware)
		return this
	}

	preRequest = (method: string) => {
		return ( url: string, rufetch?: RufetchOption) => {
			const {
				baseURL: defaultBaseURL,
				timeout: defaultTimeout,
				params: defaultParams,
				data: defaultData,
				responseType: defaultResponseType,
				cacheOptions: defaultCacheOptions,
				body: defaultBody,
				cache: defaultCache,
				credentials: defaultCredentials,
				headers: defaultHeaders,
				integrity: defaultIntegrity,
				keepalive: defaultKeepalive,
				method: defaultMethod,
				mode: defaultMode,
				redirect: defaultRedirect,
				referrer: defaultReferrer,
				referrerPolicy: defaultReferrerPolicy,
				signal: defaultSignal,
				window: defaultWindow,
				...defaultRest 
			} = this.options

			const { 
				baseURL,
				timeout,
				params,
				data,
				responseType,
				cacheOptions,
				body,
				cache,
				credentials,
				headers,
				integrity,
				keepalive,
				method,
				mode,
				redirect,
				referrer,
				referrerPolicy,
				signal,
				window,
				...restOptions 
			} = rufetch || {}
			
			const defaultRequestInit: RequestInit = {
				body: defaultBody,
				cache: defaultCache,
				credentials: defaultCredentials,
				headers: defaultHeaders,
				integrity: defaultIntegrity,
				keepalive: defaultKeepalive,
				method: defaultMethod,
				mode: defaultMode,
				redirect: defaultRedirect,
				referrer: defaultReferrer,
				referrerPolicy: defaultReferrerPolicy,
				signal: defaultSignal,
				window: defaultWindow,
			}
			const requestInit: RequestInit = {
				body,
				cache,
				credentials,
				headers,
				integrity,
				keepalive,
				method,
				mode,
				redirect,
				referrer,
				referrerPolicy,
				signal,
				window,
			}
			requestInit.method = method

			const middlewares = [
				...this.middlewares,
				middlewareCache,
				middlewareFetch
			]
			const ctx: any = {}

			const rurl = url.indexOf(defaultBaseURL || '') > -1 ? url : defaultBaseURL + url
			const reqInit = Object.assign({}, defaultRequestInit, requestInit)
			const rbody = Object.assign({}, data, body)
			
			reqInit.body = rbody ? rbody : defaultBody
			reqInit.headers = Object.assign({}, defaultHeaders, headers)

			ctx.req = {
				url: rurl,
				method,
				timeout: timeout ? timeout : (defaultTimeout || 3000),
				params: params ? params : defaultParams,
				requestInit: reqInit,
				...Object.assign({}, defaultRest, restOptions),
			}
			ctx.res = {}

			return new Promise(async (resolve, reject) => {
				try {
					await compose(middlewares)(ctx, null)
					resolve(ctx.res.data)
				} catch (error) {
					if (!error) return;
					throw error
				}
			})
		}
	}

	get = this.preRequest('get')
	post = this.preRequest('post')
	put = this.preRequest('put')
	delete = this.preRequest('delete')
	head = this.preRequest('head')
}

