import { call, put, takeLatest } from 'redux-saga/effects';
import { LoginAction } from './loginSlices.js';
import { history } from '../../../app/providers/history.js';
import { client } from '../../../app/socket/socket.js';

function* submit(action) {
	try {
		const response = yield call([client, client.emit], "set_username", action.payload);
		yield put(LoginAction.setResponse(response.id));
		localStorage.setItem('nickname', action.payload.nickname);
		yield call([history, history.push], '/wait');
	} catch (error) {
		console.log(error)
		yield put(LoginAction.setError(error));
		if(error.status === 403){
			alert('игра уже запущена')
		}else if(error.status === 409){
			alert('игрок с таким ником уже есть')
		}
	}
}

export default function* watchLogin() {
	yield takeLatest(LoginAction.submitLogin, submit);
}
