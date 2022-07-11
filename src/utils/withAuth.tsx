// Libraries
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

// Utils
import { getSafely } from '@utils';
// Components
import Section from '@layouts/Section';
// Store
import { RootState } from '@store/rootReducer';

export const withAuth = (WrappedComponent) => {
	const Wrapper = (props) => {
		const token = useSelector((state: RootState) => state.User.token);
		const router = useRouter();

		// After authentication on mobile
		const { isMobile } = router.query;

		if (isMobile && typeof window !== 'undefined' && !token) {
			router?.push('/account/login-mobile?isFail=true');

			return null;
		}

		// Just verify on client-side
		if (typeof window !== 'undefined' && !token) {
			router?.push('/account/login');

			return null;
		}

		return (
			<Section {...props}>
				<WrappedComponent {...props} />
			</Section>
		);
	};

	return Wrapper;
};

type Options = {
	isSection?: boolean;
	isHead?: boolean;
	isHeader?: boolean;
	isFooter?: boolean;
};

export const withNoAuth = (
	WrappedComponent,
	options: Options = { isSection: true, isHead: true, isHeader: true, isFooter: true },
) => {
	const { isSection, isHead, isHeader, isFooter } = options;
	const Wrapper = (props) => {
		const token = useSelector((state: RootState) => state.User.token);
		const router = useRouter();

		// Just verify on client-side
		if (typeof window !== 'undefined' && token) {
			router?.push('/home');

			return null;
		}

		if (isSection || isHead !== undefined || isHeader !== undefined || isFooter !== undefined) {
			return (
				<Section isHead={isHead} isHeader={isHeader} isFooter={isFooter} {...props}>
					<WrappedComponent {...props} />
				</Section>
			);
		}

		return <WrappedComponent {...props} />;
	};

	return Wrapper;
};

export const withAuthServer = ({
	store,
	redirect = {},
	result = {
		props: {},
	},
	context = {
		resolvedUrl: '',
	},
}) => {
	const state = getSafely(() => store.getState());
	const token = getSafely(() => state.User.token);

	if (!token) {
		return {
			redirect: {
				destination: `/account/login?next=${context?.resolvedUrl}`,
				permanent: false,
				...redirect,
			},
		};
	}

	return {
		...result,
		props: {
			...result.props,
		},
	};
};

export const withNoAuthServer = ({
	store,
	redirect = {},
	result = {
		props: {},
	},
	context = {
		resolvedUrl: '',
	},
}) => {
	const state = getSafely(() => store.getState());
	const token = getSafely(() => state.User.token);

	if (token) {
		return {
			redirect: {
				destination: `/home`,
				permanent: false,
				...redirect,
			},
		};
	}

	return {
		...result,
		props: {
			...result.props,
		},
	};
};
