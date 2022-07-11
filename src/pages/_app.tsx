// Libraries
import type { AppProps } from 'next/app';
import { PersistGate } from 'redux-persist/integration/react';
import { useStore } from 'react-redux';
import { appWithTranslation, useTranslation } from 'next-i18next';

// Store
import { wrapper } from '@store';
import { translateFunc } from '@utils';

// Styles
import 'sweetalert2/src/sweetalert2.scss';
import '@styles/animate.min.css';
import '@styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
	const store = useStore();
	const { nameSpaces = 'common' } = pageProps;
	const { t } = useTranslation(nameSpaces as string | string[]);

	return (
		<PersistGate persistor={store.persistor} loading={null}>
			{() => <Component {...pageProps} translate={t || translateFunc} />}
		</PersistGate>
	);
}

export default wrapper.withRedux(appWithTranslation(MyApp));
