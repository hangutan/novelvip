import Swal from 'sweetalert2/dist/sweetalert2';

interface SwalConfig {
	icon: 'warning' | 'error' | 'success' | 'info' | 'question';
	title: string;
	html: string;
	showCloseButton?: boolean;
	cancelButton?: boolean | string;
	confirmButton?: boolean | string;
	denyButton?: boolean | string;
	outsideClick?: boolean;
}

const SwalNotification = (configs: SwalConfig) =>
	Swal.fire({
		icon: configs.icon,
		title: configs.title,
		html: configs.html,
		showCloseButton: configs.showCloseButton || false,
		showCancelButton: !!configs.cancelButton || false,
		showConfirmButton: !!configs.confirmButton || false,
		showDenyButton: !!configs.denyButton || false,
		cancelButtonText: typeof configs.cancelButton === 'boolean' ? 'Hủy' : configs.cancelButton,
		confirmButtonText: typeof configs.confirmButton === 'boolean' ? 'OK' : configs.confirmButton,
		denyButtonText: typeof configs.denyButton === 'boolean' ? 'Từ chối' : configs.denyButton,
		allowOutsideClick: configs.outsideClick || false,
		backdrop: true,
		// allowEscapeKey: false,
		showClass: {
			popup: 'animate__animated animate__flipInX',
		},
		hideClass: {
			popup: 'animate__animated animate__flipOutX',
		},
		customClass: {
			popup: 'custom-popup',
			confirmButton: 'custom-btn confirm',
			denyButton: 'custom-btn deny',
			cancelButton: configs.denyButton ? 'custom-btn cancel' : 'custom-btn deny',
		},
		heightAuto: false,
	}).then((result) => {
		if (configs.cancelButton && configs.confirmButton && configs.denyButton) {
			return {
				isConfirmed: result?.isConfirmed,
				dismiss: result?.dismiss,
			};
		}
		return result?.isConfirmed || false;
	});

export default SwalNotification;
