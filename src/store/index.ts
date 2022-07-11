// Libraries
import { configureStore } from '@reduxjs/toolkit';
import { Store } from 'redux';
import createSagaMiddleware, { Task } from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { createWrapper, Context } from 'next-redux-wrapper';
import { nextReduxCookieMiddleware, wrapMakeStore } from 'next-redux-cookie-wrapper';

// Middleware
import rootSaga from '@store/saga';
import rootReducer from '@store/rootReducer';

export interface SagaStore extends Store {
	sagaTask?: Task;
}

let store;

export const makeStore = wrapMakeStore((context: Context) => {
	const isServer = typeof window === 'undefined';

	// Cookies => Sever back (Hydrate) => Local storage (Rehydrate)
	// If you want to get new state from server, need to be unsubscribe it on persist
	const middleCookieServer = () =>
		nextReduxCookieMiddleware({
			compress: false,
			subtrees: ['User.token', 'App.lang'],
		});

	if (isServer) {
		const sagaMiddleware = createSagaMiddleware();
		store = configureStore({
			reducer: rootReducer,
			middleware: () => [middleCookieServer(), sagaMiddleware],
		});
		(store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);

		return store;
	}

	const persistConfig = {
		key: 'GO_VIP',
		whitelist: ['User'],
		blacklist: ['App'],
		stateReconciler: autoMergeLevel2,
		storage,
	};

	const persistedReducer = persistReducer(persistConfig, rootReducer);
	const sagaMiddleware = createSagaMiddleware();
	store = configureStore({
		reducer: persistedReducer,
		middleware: () => [middleCookieServer(), sagaMiddleware],
	});

	store.persistor = persistStore(store);

	(store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);

	return store;
});

export { store };

export const wrapper = createWrapper<Store>(makeStore, {
	debug: false,
});
