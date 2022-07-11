import React from 'react';
import Image from 'next/image';
import { Modal, Button } from 'antd';

import Images from '@constants/image';

type onCancelFunc = () => void;

interface Props {
	styles: {
		[key: string]: string;
	};
	visible: boolean;
	onCancel: onCancelFunc;
	type: string;
}

const PopupAuth = (props: Props) => {
	const { styles, visible = false, onCancel, type = 'login' } = props;

	return (
		<Modal
			className={styles.auth__modal}
			visible={visible}
			footer={null}
			onCancel={onCancel}
		>
			{type === 'login' && (
				<>
					<div className={styles['auth__modal-title']}>
						Tài khoản hoặc mật khẩu của bạn không đúng!
					</div>
					<div className={styles['auth__modal-img']}>
						<Image className="header__logo" src={Images.banned} />
					</div>
				</>
			)}
			{type === 'login_3' && (
				<>
					<div className={styles['auth__modal-title']}>
						Tài khoản hoặc mật khẩu của bạn không đúng!
					</div>
					<div>
						<Button className={styles['auth__modal-button']}>
							Lấy lại mật khẩu
						</Button>
					</div>
					<div className={styles['auth__modal-img']}>
						<Image className="header__logo" src={Images.homie03} />
					</div>
				</>
			)}
			{type === 'reset' && (
				<>
					<div className={styles['auth__modal-title']}>
						Mật khẩu mới của bạn đã được tạo thành công
					</div>
					<div>
						<Button className={styles['auth__modal-button']}>
							ĐĂNG NHẬP NGAY
						</Button>
					</div>
					<div className={styles['auth__modal-img']}>
						<Image className="header__logo" src={Images.homie05} />
					</div>
				</>
			)}
		</Modal>
	);
};

export default PopupAuth;
