// Libraries
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Reducers
import App from '@store/app/reducer';
import User from '@store/user/reducer';

const appPersistConfig = {
	key: 'App',
	storage,
	blacklist: ['countLoading'],
};

const rootReducer = combineReducers({
	App: persistReducer(appPersistConfig, App),
	User,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
