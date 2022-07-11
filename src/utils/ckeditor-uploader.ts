export class base64UploadAdapter {
	constructor(loader) {
		this.loader = loader;
	}

	upload() {
		return new Promise((resolve, reject) => {
			const reader = (this.reader = new window.FileReader());
			reader.addEventListener('load', () => {
				resolve({ default: reader.result });
			});
			reader.addEventListener('error', (err) => {
				reject(err);
			});
			reader.addEventListener('abort', () => {
				reject();
			});
			this.loader.file.then((file) => {
				reader.readAsDataURL(file);
			});
		});
	}
}

export class serverUploadAdapter {
	constructor(loader) {
		this.loader = loader;
	}

	upload() {
		return this.loader.file
			.then(
				(file) =>
					new Promise((resolve, reject) => {
						resolve({
							default:
								'https://static.remove.bg/remove-bg-web/a76316286d09b12be1ebda3b400e3f44716c24d0/assets/start_remove-c851bdf8d3127a24e2d137a55b1b427378cd17385b01aec6e59d5d4b5f39d2ec.png',
						});
					}),
			)
			.catch(() => {
				alert('Upload hình không thành công !');
			});
	}
}
