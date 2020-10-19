
export default (reload = true) => {
	caches.keys().then((keys) => {
		for (let key of keys) {
			caches.delete(key).then((res) => {
				console.log(res);
			});
		}
		localStorage.clear();
		sessionStorage.clear();
	});
};
