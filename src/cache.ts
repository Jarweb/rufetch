// 默认过期时长，只有 http get、显式设置 cache 的数据请求才进行缓存
const EXPIRE_AGE = 5000
// 会打包出重复的 2份代码，每份代码初始化会重置 window._request_cache_
window._request_cache_ = window._request_cache_ || {}

export function getRequestCache(key: string) {
	const now = Date.now()
	// 过期
	if (window._request_cache_[key] &&
		window._request_cache_[key]?.status === 'success' &&
		(window._request_cache_[key]?.createTime as number) + (window._request_cache_[key]?.expiredAge as number) <= now
	) {
		removeRequestCache(key)
	}
	return window._request_cache_[key]
}

export function setRequestCache(key: string, value: any) {
	const now = Date.now()
	// 未过期
	if (window._request_cache_[key] &&
		window._request_cache_[key]?.status === 'success' &&
		(window._request_cache_[key]?.createTime as number) + (window._request_cache_[key]?.expiredAge as number) > now) return;

	window._request_cache_[key] = {
		expiredAge: window._request_cache_[key]?.expiredAge || EXPIRE_AGE,
		status: 'success',
		createTime: Date.now(),
		value: value,
	}
}

export function pendingRequestCache(key: string, expiredAge?: number) {
	window._request_cache_[key] = {
		status: 'pending',
		createTime: Date.now(),
		expiredAge: expiredAge || EXPIRE_AGE,
		value: undefined,
	}
}

export function removeRequestCache(key: string) {
	window._request_cache_[key] = undefined
}