import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { Spin } from 'antd';

import { actionTypes } from '@store/user/middleware';
import { initialStateUser } from '@store/user/reducer';

interface LoginMobileProps {
	translate: (str: string, obj?: { text: string }) => string;
}

const LoginMobile = (props: LoginMobileProps) => {
	const { translate = (v, t) => (t ? v.replace(/{{text}}/gi, t.text) : v) } = props;

	const router = useRouter();
	const dispatch = useDispatch();

	const goToHome = () => {
		if (typeof window !== 'undefined') {
			router?.push('/home?isMobile=true');

			return null;
		}
	};

	useEffect(() => {
		const { query } = router;
		const { token } = query;

		if (token) {
			dispatch({
				type: actionTypes.SET_USER_INFO,
				payload: {
					...initialStateUser,
					token,
					cb: goToHome,
				},
			});
		}
	}, []);

	return (
		<div className="h-72 flex flex-col items-center justify-center">
			<div>
				<Spin />
			</div>
			<div>{translate('Authenticating')}...</div>
		</div>
	);
};

export default LoginMobile;
