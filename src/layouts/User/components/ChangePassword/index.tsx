import type { NextPage } from 'next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button } from 'antd';

import { actionTypes } from '@store/user/middleware';
import { useDidMountEffect } from '@hooks';

import styles from './ChangePass.module.scss';

const ChangePassword = ({ translate }) => {
	const {
		reset,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: 'all',
		defaultValues: {
			old_password: '',
			new_password: '',
			new_password_confirmation: '',
		},
	});
	const [isModal, setIsModal] = useState(false);
	const [dataPass, setDataPass] = useState({
		old_password: '',
		new_password: '',
		new_password_confirmation: '',
	});
	const route = useRouter();
	const dispatch = useDispatch();

	const token = useSelector((state) => state?.User?.token);

	useDidMountEffect(() => {
		if (!token) {
			localStorage.clear();
			route.push('/account/login');
		}
	}, [token]);

	const onOpen = () => {
		reset();
		setIsModal(true);
	};

	const handleOk = async (user) => {
		dispatch({
			type: actionTypes.CHANGE_PASSWORD,
			payload: {
				old_password: user?.old_password,
				new_password: user?.new_password,
				handleCancel,
			},
		});
	};

	const handleCancel = () => {
		reset();
		setIsModal(false);
	};

	const cusButton = () => (
		<Button onClick={onOpen} className={styles.pass__changePass}>
			{translate('Change password')}
		</Button>
	);

	return (
		<>
			{cusButton()}
			<Modal
				className={styles.modalChangePass}
				title={translate('Change the password')}
				visible={isModal}
				onOk={handleSubmit(handleOk)}
				onCancel={handleCancel}
				cancelText={translate('Cancel')}
				okText={translate('Save')}
			>
				<form className={styles.pass}>
					<div className={styles.pass__item}>
						<div className={styles.pass__label}>{translate('Old password')}</div>
						<input
							className={styles.pass__input}
							placeholder={translate('Enter old password')}
							id="old_password"
							name="old_password"
							type="text"
							{...register('old_password', {
								required: translate('Please enter old password'),
							})}
						/>
						<div className={styles.pass__error}>{errors?.old_password?.message}</div>
					</div>
					<div className={styles.pass__item}>
						<div className={styles.pass__label}>{translate('New password')}</div>
						<input
							className={styles.pass__input}
							placeholder={translate('Enter new password')}
							id="new_password"
							name="new_password"
							type="text"
							{...register('new_password', {
								required: translate('Please enter new password'),
							})}
						/>
						<div className={styles.pass__error}>{errors?.new_password?.message}</div>
					</div>
					<div className={styles.pass__item}>
						<div className={styles.pass__label}>{translate('Enter the password')}</div>
						<input
							className={styles.pass__input}
							placeholder={translate('Enter the password')}
							id="new_password_confirmation"
							name="new_password_confirmation"
							type="text"
							{...register('new_password_confirmation', {
								required: translate('Please enter the password'),
							})}
						/>
						<div className={styles.pass__error}>{errors?.new_password_confirmation?.message}</div>
					</div>
				</form>
			</Modal>
		</>
	);
};

export default ChangePassword;
