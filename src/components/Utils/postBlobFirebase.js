import DBConnection from '../../config/DBConnection';

export function uploadFileToFirebase(blob, fileName) {
  const ref = DBConnection.storage().ref()
  const fileRef = ref.child(fileName)
  // This function
  // console.log('blob', blob)
  return new Promise(function (resolve, reject) {
    fileRef
      .put(blob)
      .then(snap => {
        // console.log('Uploaded ', snap, fileRef)
        snap.ref.getDownloadURL().then((url) => {
          // console.log(url)
          resolve(url)
        })
      })
      .catch(err => {
        console.log('Error uploading', err)
        reject(err)
      })
  })
}

