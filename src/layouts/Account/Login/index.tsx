// Libraries
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Switch } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import classnames from 'classnames';

// Constants
import Images from '@constants/image';
// Store
import { actionTypes } from '@store/user/middleware';
// Components
import AuthenticationGoogle from '@layouts/Account/components/AuthenticationGoogle';
// import PopupAuth from '@layouts/Account/components/PopupAuth';

// Styles
import styles from '../index.module.scss';

interface Props {
	translate: (str: string, obj?: { text: string }) => string;
}

const Login = (props: Props) => {
	const { translate = (v, t) => (t ? v.replace(/{{text}}/gi, t.text) : v) } = props;
	const dispatch = useDispatch();
	const router = useRouter();
	const [modalVisible, setModalVisible] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: 'all',
		defaultValues: {
			username: '',
			password: '',
		},
	});

	const goBack = (path = router?.query?.next || '/home') => {
		router?.push(path as string);
	};

	const onSubmit = async (user) => {
		console.log(user, 'user');

		dispatch({
			type: actionTypes.LOGIN_USER,
			payload: {
				username: user?.username,
				password: user?.password,
				setModalVisible,
				goBack,
			},
		});
	};

	useEffect(() => {
		if (!router.query.token) return;
		dispatch({
			type: actionTypes.LOGIN_WITH_TOKEN,
			payload: {
				token: router.query.token,
			},
		});
	}, []);

	return (
		<>
			<main className={classnames(styles.auth, styles.signin)}>
				<div className={styles.auth__container}>
					<div className={styles.auth__left}>
						<div className={styles['auth__left-img']}>
							<Image
								src={Images.bgSignin}
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
						<form className={styles.auth__form}>
							<div className={styles['auth__form-header']}>
								<div className={styles['auth__form-title']}>{translate('Sign In')}</div>
								{/* <div className={styles['auth__form-subtitle']}>
									{translate('Enter your account and password to sign in')}
								</div> */}
							</div>

							{/* <div className={styles['auth__form-group']}>
								<label htmlFor="username" className={styles['auth__form-label']}>
									{translate('Account')}
									<input
										className={styles['auth__form-input']}
										placeholder={translate('Enter {{text}}', { text: translate('Account') })}
										id="username"
										name="username"
										type="text"
										{...register('username', {
											required: translate('Please enter your {{text}}', {
												text: translate('Account'),
											}),
										})}
									/>
								</label>
								<div className={styles['auth__form-error']}>{errors?.username?.message}</div>
							</div>
							<div className={styles['auth__form-group']}>
								<label htmlFor="username" className={styles['auth__form-label']}>
									{translate('Password')}
									<input
										className={styles['auth__form-input']}
										placeholder={translate('Enter {{text}}', { text: translate('Password') })}
										id="password"
										name="password"
										type="password"
										{...register('password', {
											required: translate('Please enter your {{text}}', {
												text: translate('Password'),
											}),
										})}
									/>
								</label>
								<div className={styles['auth__form-error']}>{errors?.password?.message}</div>
							</div>

							<div className={styles['auth__form-switch']}>
								<Switch onChange={(e) => console.log(e)} />
								<span>{translate('Remember me')}</span>
							</div> */}

							<div className={styles['auth__form-btn-group']}>
								{/* <button
									type="button"
									onClick={handleSubmit(onSubmit)}
									className={styles['auth__form-btn']}
								>
									{translate('SIGN IN')}
								</button> */}
								<AuthenticationGoogle
									goBack={goBack}
									buttonRenderer={({ signIn, signOut }) => (
										<button
											type="button"
											onClick={signIn}
											className={classnames(styles['auth__form-btn'], styles.google)}
										>
											<Image src={Images.logo} width="24px" height="24px" alt="Google Logo" />
											{translate('Sign in with Google Account')}
										</button>
									)}
								/>
							</div>

							{/* <div className={styles['auth__form-des']}>
								{translate('Don’t have an account')}?{' '}
								<Link href="/account/register">
									<a className={styles['auth__form-link']}>{translate('Sign Up')}</a>
								</Link>{' '}
								{translate('or')}{' '}
								<Link href="/account/forgot-password">
									<a className={styles['auth__form-forgot']}>{translate('forgot the password')}?</a>
								</Link>
							</div> */}
						</form>
					</div>
				</div>
			</main>
			{/* <PopupAuth styles={styles} visible={modalVisible} onCancel={() => setModalVisible(false)} type="login" /> */}
		</>
	);
};

export default Login;
