import { call, put, takeLatest } from 'redux-saga/effects';
import { LoginAction } from './loginSlices.js';
import { history } from '../../../app/providers/history.js'; 
import { postUser } from '../../../shared/api/loginApi.js';

function* submit(action) {
	try {
		const response = yield call(postUser, action.payload);
		yield put(LoginAction.setResponse(response));
		yield call([history, history.push], '/wait');
	} catch (error) {
		yield put(LoginAction.setError(error));
	}
}

export default function* watchLogin() {
	yield takeLatest(LoginAction.submitLogin, submit);
}
