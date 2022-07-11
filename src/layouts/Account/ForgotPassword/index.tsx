// Libraries
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import classnames from 'classnames';

// Constants
import Images from '@constants/image';
// Store
import { actionTypes } from '@store/user/middleware';
// Component
// import PopupAuth from '../Account/components/PopupAuth';

// Styles
import styles from '../index.module.scss';

interface Props {
	translate: (str: string, obj?: { text: string }) => string;
}

const STEP = {
	STEP_1: 'STEP_1',
	STEP_2: 'STEP_2',
	STEP_3: 'STEP_3',
	STEP_4: 'STEP_4',
};

const ForgotPassword = (props: Props) => {
	const { translate = (v, t) => (t ? v.replace(/{{text}}/gi, t.text) : v) } = props;
	const router = useRouter();

	const [user, setUser] = useState({
		email: '',
		token: '',
		password: '',
		password_confirmation: '',
	});
	const [step, setStep] = useState(STEP.STEP_1);
	const [modalVisible, setModalVisible] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		const { query } = router || {};
		const { token, email } = (query as { [key: string]: string }) || {};

		if (token && email) {
			setUser({ ...user, email, token });
			setStep(STEP.STEP_3);
		}
	}, [router]);

	const handleOnChange = (event) => {
		setUser({ ...user, [event.target.name]: event.target.value });
	};

	const onSendCode = async (event) => {
		event.preventDefault();
		if (!user.email) {
			return false;
		}

		dispatch({
			type: actionTypes.GET_CODE_RESET_PASSWORD,
			payload: { email: user.email },
		});

		return setStep(STEP.STEP_2);
	};

	const onResetPassword = async (event) => {
		event.preventDefault();
		if (!user.token) {
			return false;
		}

		return setStep(STEP.STEP_3);
	};

	const onConfirmReset = async (event) => {
		event.preventDefault();
		if (!user.password || !user.password_confirmation) {
			return false;
		}

		return dispatch({
			type: actionTypes.RESET_PASSWORD,
			payload: {
				email: user?.email,
				token: user?.token,
				password: user?.password,
				password_confirmation: user?.password_confirmation,
				setModalVisible,
			},
		});
	};

	return (
		<>
			{/* <main className={classnames(styles.auth, styles.forgot)}>
				<div className={classnames(styles.auth__container)}>
					{step === STEP.STEP_1 && (
						<form className={styles.auth__form}>
							<div className={styles['auth__form-header']}>
								<div className={styles['auth__form-title']}>{translate('Forgot the password')}</div>
							</div>
							<div className={styles['auth__form-group']}>
								<input
									className={styles['auth__form-input']}
									id="email"
									name="email"
									type="text"
									onChange={handleOnChange}
									placeholder={translate('Enter {{text}}', { text: translate('register email') })}
								/>
							</div>
							<div className={styles['auth__form-btn-group']}>
								<button type="submit" onClick={onSendCode} className={styles['auth__form-btn']}>
									{translate('SEND CODE')}
								</button>
							</div>
						</form>
					)}

					{step === STEP.STEP_2 && (
						<form className={styles.auth__form}>
							<div className={styles['auth__form-header']}>
								<div className={styles['auth__form-title']}>{translate('Forgot the password')}</div>
							</div>
							<div className={styles['auth__form-group']}>
								<input
									className={styles['auth__form-input']}
									id="token"
									name="token"
									type="text"
									onChange={handleOnChange}
									placeholder={translate('Enter {{text}}', { text: translate('Code') })}
								/>
							</div>
							<div className={styles['auth__form-btn-group']}>
								<button type="submit" onClick={onResetPassword} className={styles['auth__form-btn']}>
									{translate('CONFIRM')}
								</button>
							</div>
							<div className={styles['auth__form-des']}>
								{translate('Mail code was sent. Didn’t receive')}?{' '}
								<button onClick={onSendCode}>
									<a className={styles['auth__form-link']}>{translate('Resend')}</a>
								</button>
							</div>
						</form>
					)}

					{step === STEP.STEP_3 && (
						<form className={styles.auth__form}>
							<div className={styles['auth__form-header']}>
								<div className={styles['auth__form-title']}>{translate('Forgot the password')}</div>
							</div>
							<div className={styles['auth__form-group']}>
								<input
									className={styles['auth__form-input']}
									type="text"
									id="password"
									name="password"
									onChange={handleOnChange}
									placeholder={translate('Enter {{text}}', { text: translate('new password') })}
								/>
							</div>
							<div className={styles['auth__form-group']}>
								<input
									className={styles['auth__form-input']}
									type="text"
									id="password_confirmation"
									name="password_confirmation"
									onChange={handleOnChange}
									placeholder={translate('Enter {{text}}', { text: translate('confirm password') })}
								/>
							</div>
							<div className={styles['auth__form-btn-group']}>
								<button type="submit" onClick={onConfirmReset} className={styles['auth__form-btn']}>
									{translate('SAVE PASSWORD')}
								</button>
							</div>
						</form>
					)}
				</div>
			</main> */}

			{/* <PopupAuth
				styles={styles}
				visible={modalVisible}
				onCancel={() => setModalVisible(false)}
				type="reset"
			/> */}
			<main className={classnames(styles.auth, styles.forgot)}>
				<div className={styles.auth__container}>
					<div className={styles.auth__left}>
						<div className={styles['auth__left-img']}>
							<Image
								src={Images.bgForgot}
								layout="fill"
								objectFit="contain"
								alt="forgot password background"
							/>
						</div>
						<div className={styles['auth__left-des']}>
							Telegram is a cloud-based mobile and desktop messaging app with a focus on security and
							speed. Telegram is a cloud-based mobile and desktop messaging app with a focus on security
							and speed.
						</div>
					</div>
					<div className={styles.auth__right}>
						<div className={styles['auth__right-imgMobile']}>
							<Image src={Images.bgForgotMobile} layout="responsive" alt="forgot password image" />
						</div>
						{step === STEP.STEP_1 && (
							<form className={classnames(styles.auth__form)}>
								<div className={styles['auth__form-header']}>
									<div className={styles['auth__form-title']}>{translate('Forgot the password')}</div>
								</div>
								<div className={styles['auth__form-group']}>
									<input
										className={styles['auth__form-input']}
										id="email"
										name="email"
										type="text"
										onChange={handleOnChange}
										placeholder={translate('Enter {{text}}', {
											text: translate('register email'),
										})}
									/>
								</div>
								<div className={styles['auth__form-btn-group']}>
									<button type="submit" onClick={onSendCode} className={styles['auth__form-btn']}>
										{translate('SEND CODE')}
									</button>
								</div>
							</form>
						)}

						{step === STEP.STEP_2 && (
							<form className={styles.auth__form}>
								<div className={styles['auth__form-header']}>
									<div className={styles['auth__form-title']}>{translate('Forgot the password')}</div>
								</div>
								<div className={styles['auth__form-group']}>
									<input
										className={styles['auth__form-input']}
										id="token"
										name="token"
										type="text"
										onChange={handleOnChange}
										placeholder={translate('Enter {{text}}', { text: translate('Code') })}
									/>
								</div>
								<div className={styles['auth__form-btn-group']}>
									<button
										type="submit"
										onClick={onResetPassword}
										className={styles['auth__form-btn']}
									>
										{translate('CONFIRM')}
									</button>
								</div>
								<div className={styles['auth__form-des']}>
									{translate('Mail code was sent. Didn’t receive')}?{' '}
									<button type="button" onClick={onSendCode}>
										<a className={styles['auth__form-link']}>{translate('Resend')}</a>
									</button>
								</div>
							</form>
						)}

						{step === STEP.STEP_3 && (
							<form className={styles.auth__form}>
								<div className={styles['auth__form-header']}>
									<div className={styles['auth__form-title']}>{translate('Forgot the password')}</div>
								</div>
								<div className={styles['auth__form-group']}>
									<input
										className={styles['auth__form-input']}
										type="text"
										id="password"
										name="password"
										onChange={handleOnChange}
										placeholder={translate('Enter {{text}}', {
											text: translate('new password'),
										})}
									/>
								</div>
								<div className={styles['auth__form-group']}>
									<input
										className={styles['auth__form-input']}
										type="text"
										id="password_confirmation"
										name="password_confirmation"
										onChange={handleOnChange}
										placeholder={translate('Enter {{text}}', {
											text: translate('confirm password'),
										})}
									/>
								</div>
								<div className={styles['auth__form-btn-group']}>
									<button type="submit" onClick={onConfirmReset} className={styles['auth__form-btn']}>
										{translate('SAVE PASSWORD')}
									</button>
								</div>
							</form>
						)}
						<div className={styles['auth__right-slide']}>
							<span className={classnames(styles['auth__right-slide-btn'], !!step && styles.active)} />
							<span
								className={classnames(
									styles['auth__right-slide-btn'],
									step !== STEP.STEP_1 && styles.active,
								)}
							/>
							<span
								className={classnames(
									styles['auth__right-slide-btn'],
									step === STEP.STEP_3 && styles.active,
								)}
							/>
						</div>
					</div>
				</div>
			</main>
		</>
	);
};

export default ForgotPassword;
