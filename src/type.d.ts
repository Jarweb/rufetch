interface RufetchRequestCache {
	[key: string]: {
		status: 'pending' | 'success',
		createTime: number,
		expiredAge: number,
		value: any
	} | undefined
}

interface Window {
	_request_cache_: RufetchRequestCache
}