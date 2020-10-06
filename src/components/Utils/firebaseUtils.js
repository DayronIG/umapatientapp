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
		return await firestore
			.collection(path)
			.get()
			.then((res) => res.docs.map((item) => item.data()));
	} catch (error) {
		console.error(error);
	}
}

export async function putFileFB(file, fileName) {
	try {
		return await ref
			.child(fileName)
			.put(file)
			.then(async (snap) => await snap.ref.getDownloadURL());
	} catch (error) {
		console.error(error);
	}
}

// export function autoClickUrlFB () {
//   try {
//     const path = `/${att.patient.dni}/recipes/${att.assignation_id}.pdf`
//     // Find all the prefixes and items.
//     storage.ref(path)
//       .getDownloadURL()
//       .then(function (url) {
//         var link = document.createElement("a")
//         if (link.download !== undefined) {
//           link.setAttribute("href", url)
//           link.setAttribute("target", "_blank")
//           link.style.visibility = 'hidden'
//           document.body.appendChild(link)
//           link.click()
//           document.body.removeChild(link)
//         }
//       })
//   } catch (err) {
//     console.log(err)
//   }
// }
