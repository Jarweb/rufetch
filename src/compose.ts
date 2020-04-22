export default function compose (middleware: any[]) {
	let index = -1

	return function (context: any, next: any) {
		function dispatch (i: number): any {
			if (i <= index) {
				return Promise.reject(new Error(''))
			}

			index = i

			let fn = middleware[i]
			if (i === middleware.length) fn = next;
			if (!fn) return Promise.resolve()

			try {
				return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
			} catch (error) {
				return Promise.reject(error)
			}
		}

		return dispatch(0)
	}
}