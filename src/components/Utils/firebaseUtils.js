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
