// Libraries
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Checkbox } from 'antd';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import classnames from 'classnames';
import * as Yup from 'yup';

// Constants
import { actionTypes } from '@store/user/middleware';
import { appConfigs } from '@constants';

// Styles
import styles from '../index.module.scss';

interface Props {
	translate: (str: string, obj?: { text: string }) => string;
}

type ReCaptchaRef = {
	executeAsync: () => string;
	reset: () => string;
};

const Register = (props: Props) => {
	const { translate = (v, t) => (t ? v.replace(/{{text}}/gi, t.text) : v) } = props;
	const reCaptchaRef = useRef<ReCaptchaRef | null>();
	const dispatch = useDispatch();
	const router = useRouter();

	const validationSchema = Yup.object().shape({
		username: Yup.string().required(translate('Please enter your account name')),
		email: Yup.string().email(translate('Please enter the correct email format')),
		password: Yup.string()
			.required(translate('Password is required'))
			.min(6, translate('Password must be at least 6 characters')),
		confirm_password: Yup.string()
			.required(translate('Confirm Password is required'))
			.oneOf([Yup.ref(translate('password'))], translate('Passwords must match')),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: 'all',
		resolver: yupResolver(validationSchema),
		defaultValues: {
			username: '',
			email: '',
			password: '',
			confirm_password: '',
		},
	});

	const goBack = (path = '/') => {
		router?.push(path as string);
	};

	const refreshCaptcha = () => {
		reCaptchaRef.current.reset();
	};

	const onSubmit = async (user) => {
		if (reCaptchaRef?.current) {
			const token = await reCaptchaRef?.current?.executeAsync();
			dispatch({
				type: actionTypes.REGISTER_USER,
				payload: {
					username: user?.username,
					email: user?.email,
					password: user?.password,
					confirm_password: user?.confirm_password,
					captcha_token: token,
					goBack,
					refreshCaptcha,
				},
			});
		}
	};

	return (
		<>
			<main className={classnames(styles.auth, styles.register)}>
				<div className={styles.auth__container}>
					<form className={styles.auth__form}>
						<div className={styles['auth__form-header']}>
							<div className={styles['auth__form-title']}>{translate('Register')}</div>
						</div>
						<div className={styles['auth__form-group']}>
							<input
								className={styles['auth__form-input']}
								placeholder={translate('Phone')}
								id="username"
								name="username"
								type="text"
								{...register('username')}
							/>
							<div className={styles['auth__form-error']}>{errors?.username?.message}</div>
						</div>
						<div className={styles['auth__form-group']}>
							<input
								className={styles['auth__form-input']}
								placeholder={translate('Email')}
								id="email"
								name="email"
								{...register('email')}
							/>
							<div className={styles['auth__form-error']}>{errors?.email?.message}</div>
						</div>
						<div className={styles['auth__form-group']}>
							<input
								className={styles['auth__form-input']}
								placeholder={translate('Password')}
								id="password"
								name="password"
								type="password"
								{...register('password')}
							/>
							<div className={styles['auth__form-error']}>{errors?.password?.message}</div>
						</div>
						<div className={styles['auth__form-group']}>
							<input
								type="password"
								className={styles['auth__form-input']}
								placeholder={translate('Confirm Password')}
								id="confirm_password"
								name="confirm_password"
								{...register('confirm_password')}
							/>
							<div className={styles['auth__form-error']}>{errors?.confirm_password?.message}</div>
						</div>

						<div className={styles['auth__form-term']}>
							<Checkbox onChange={(e) => console.log(e)}>
								{translate('I agree the')}{' '}
								<Link href="/term-conditions">
									<a className={styles['auth__form-link']}>{translate('Terms and Conditions')}</a>
								</Link>
							</Checkbox>
						</div>

						<div className={styles['auth__form-btn-group']}>
							<button type="button" onClick={handleSubmit(onSubmit)} className={styles['auth__form-btn']}>
								{translate('SIGN UP')}
							</button>
						</div>

						<div className={styles['auth__form-des']}>
							{translate('Already have an account?')}{' '}
							<Link href="/account/login">
								<a className={styles['auth__form-link']}>{translate('Sign In')}</a>
							</Link>
						</div>

						<ReCAPTCHA sitekey={appConfigs.RECAPTCHA_SITE_KEY} ref={reCaptchaRef} size="invisible" />
					</form>
				</div>
			</main>
		</>
	);
};

export default Register;
