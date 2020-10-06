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
      };
      xhr.open('GET', url);
      return xhr.send();
    
    }).catch(function(error) {
      // Handle any errors
    });
  });
}