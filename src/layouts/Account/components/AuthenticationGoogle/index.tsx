import { useDispatch } from 'react-redux';
import { useGoogleLogin, useGoogleLogout } from 'react-google-login';
import { useRouter } from 'next/router';

import { actionTypes } from '@store/user/middleware';
// Services
import authServices from '@services/auth';
import { appConfigs } from '@constants';

// Styles
import styles from './Authen.module.scss';

type AuthenticationGoogleProps = {
	type?: string;
	buttonRenderer: ({ signIn, signOut }: { signIn: () => void; signOut: () => void }) => JSX.Element;
	goBack: () => void;
};
const AuthenticationGoogle = (props: AuthenticationGoogleProps) => {
	const { buttonRenderer, type = 'login', goBack } = props;
	const router = useRouter();
	const { query } = router;

	const dispatch = useDispatch();

	const onLoginSuccess = async (res) => {
		const userId = res?.profileObj?.googleId;
		const fullName = res?.profileObj?.name;
		const idToken = res?.tokenId;
		const image = res?.profileObj?.imageUrl;
		const email = res?.profileObj?.email;

		const loginWithSocial = await authServices.loginSocial(
			{
				social_token: idToken,
				social_id: userId,
				name: fullName,
				image,
				email,
				referral: query?.referral,
			},
			{},
		);

		if (loginWithSocial?.success) {
			dispatch({
				type: actionTypes.SET_USER_INFO,
				payload: {
					token: loginWithSocial?.token,
					userInfo: loginWithSocial?.user,
					authentication: res?.profileObj,
				},
			});

			goBack();
		} else {
			dispatch({
				type: actionTypes.SET_USER_INFO,
				payload: {
					token: '',
					userInfo: {},
					authentication: {},
				},
			});
		}
	};

	const onLoginFailure = (res) => {
		// console.log(res);
	};

	const onLogoutSuccess = () => {
		// console.log(res);

		dispatch({
			type: actionTypes.SET_USER_INFO,
			payload: {
				authentication: {},
			},
		});
	};

	const onLogoutFailure = () => {
		// console.log(res);
	};

	const { signIn, loaded } = useGoogleLogin({
		clientId: appConfigs.GOOGLE_AUTH_CLIENT_ID,
		onSuccess: onLoginSuccess,
		onFailure: onLoginFailure,
	});

	const { signOut } = useGoogleLogout({
		clientId: appConfigs.GOOGLE_AUTH_CLIENT_ID,
		onLogoutSuccess,
		onFailure: onLogoutFailure,
	});

	const renderButton = () =>
		type === 'logout' ? (
			<button type="button" onClick={() => signOut()} className={styles.button}>
				Sign out
			</button>
		) : (
			<button type="button" onClick={() => signIn()} className={styles.button}>
				Sign in
			</button>
		);

	const renderCustomButton = () => {
		if (typeof buttonRenderer === 'function') {
			return buttonRenderer({ signIn, signOut });
		}

		return renderButton();
	};

	return <>{renderCustomButton()}</>;
};

export default AuthenticationGoogle;
