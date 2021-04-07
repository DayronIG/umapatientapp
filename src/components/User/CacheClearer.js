import db  from '../../config/DBConnection';


export default async (reload = true) => {
	await db.auth().signOut()
	await caches.keys().then((keys) => {
		for (let key of keys) {
			caches.delete(key).then((res) => {
				console.log(res);
			});
		}
		localStorage.clear();
		sessionStorage.clear();
	});
};
