export const senserizeObj = (obj: object) => {
	let res = ''
	Object.keys(obj).forEach(item => {
		res += `${res ? '&' : ''}${item}=${(obj as any)[item]}`
	})
	return res
}

export const timeoutHandle = (delay: number) => {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			clearTimeout(timer)
			resolve('fetch timeout')
		}, delay)
	})
}