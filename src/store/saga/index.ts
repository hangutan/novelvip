// Libraries
import { all } from 'redux-saga/effects';

// MiddleWares
import middlewareApp from '@store/app/middleware';
import middlewareUser from '@store/user/middleware';

function* rootSaga() {
	yield all([middlewareApp(), middlewareUser()]);
}

export default rootSaga;
