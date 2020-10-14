import DBConnection from '../../config/DBConnection';

export default function (path) {
  const ref = DBConnection.storage().ref()
  return new Promise(function (resolve, reject) {
    ref.child(path).getDownloadURL().then(function(url) {
      // `url` is the download URL for 'images/stars.jpg'
      // This can be downloaded directly:
      let xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function(event) {
        let blob = xhr.response;
        resolve(blob);
        // document.querySelector('#audio').src = URL.createObjectURL(this.response)
      };
      xhr.open('GET', url);
      xhr.send();
      

    }).catch(function(error) {
      // Handle any errors
    });
  });
}