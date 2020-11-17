import DBConnection from '../../config/DBConnection';

const firestore = DBConnection.firestore();
const ref = DBConnection.storage().ref();

export async function getDocumentFB(path) {
	try {
		return (await firestore.doc(path).get()).data();
	} catch (error) {
		console.error(error);
	}
}

export async function getCollectionFB(path) {
	try {
		const res = await firestore.collection(path).get();
		const documents = res.docs.map((item) => item.data());
		return documents;
	} catch (error) {
		console.error(error);
	}
}

export async function putFileFB(file, fileName) {
	try {
		const res = await ref.child(fileName).put(file);
		const url = await res.ref.getDownloadURL();
		return url;
	} catch (error) {
		console.error(error);
	}
}

export async function getDocumentsByFilter(route, filters, limit = false, postFilters = false) {
	/**
   * takes in a route and filters as parameters, be mindfull, more than 3 filters will need an index
   * also take into account the fact that .where() querys are inefficient.
   * @param {string} url - The route of the collection.
   * @param {array} filters -  array of filter objects like so: [
	  {field: 'specialty', value: 'psicologia', comparator: '=='},
	  {field: 'domain', value: 'onboarding', comparator: '=='}
	]
   */
	let result = [];
	try {
		let ref = await firestore.collection(route);
		await filters.forEach((filter) => {
			ref = ref.where(filter.field, filter.comparator, filter.value);
		});
		if (limit !== false) ref.limit(limit)
		await ref.get().then((snapshot) => {
			snapshot.forEach((doc) => {
				let document = doc.data();
				document.docId = doc.id;
				result.push(document);
			});
		});
	} catch (err) {
		console.error('errror', err);
	}
	if (!postFilters) return result;
	/* else {
		console.log("CAYO AL ELSE")
		return filter(result, postFilters)
	} */
}

export async function snapDocumentsByFilter(route, filters, action = (data) => console.log(data),limit = false, postFilters = false) {
	/**
   * takes in a route and filters as parameters, be mindfull, more than 3 filters will need an index
   * also take into account the fact that .where() querys are inefficient.
   * @param {string} url - The route of the collection.
   * @param {array} filters -  array of filter objects like so: [
	  {field: 'specialty', value: 'psicologia', comparator: '=='},
	  {field: 'domain', value: 'onboarding', comparator: '=='}
	]
   */
	try {
		let ref = await firestore.collection(route);
		await filters.forEach((filter) => {
			ref = ref.where(filter.field, filter.comparator, filter.value);
		});
		if (limit !== false) ref.limit(limit)
		ref.onSnapshot(async (snapshot) => {
			let result = [];
			snapshot.forEach((doc) => {
				let document = {...doc.data(), docId: doc.id};
				result.push(document);
				console.log(result)
				return result
			});
			if (!postFilters) action(result);
		})
	} catch (err) {
		console.error('errror', err);
	}
	/* else {
		console.log("CAYO AL ELSE")
		return filter(result, postFilters)
	} */
}