import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

toastr.options = {
	hideDuration: 300,
	timeOut: 5000,
	closeButton: true,
	progressBar: true,
	closeMethod: 'fadeOut',
};

const success = (msg) => toastr.success(msg || 'Thực hiện thành công!!');

const error = (msg) => toastr.error(msg || 'Có lỗi xảy ra, vui lòng kiểm tra lại !');

export default { success, error };
