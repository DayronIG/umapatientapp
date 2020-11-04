export 	function fileToBlob(file) {
	return new Promise((resolve, reject) => {
		try {
			let reader = new FileReader();
			reader.onload = function(e) {
					let blob = new Blob([new Uint8Array(e.target.result)], { type: file.type });
					resolve(blob);
			};
			reader.readAsArrayBuffer(file);
		} catch (error) {
			console.error(error);				
			reject(false);
		}
	})
}