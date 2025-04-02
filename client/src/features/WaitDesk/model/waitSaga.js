import { call, put, takeLatest } from 'redux-saga/effects';
import { waitActions } from './waitSlices.js';
import { getQueue, postTable } from '../../../shared/api/waitApi.js';

function* postWaitSaga(action) {
	try {
		const response = yield call(postTable, action.payload);
		yield put(waitActions.setQueue(response));
	} catch (error) {
		yield put(waitActions.setError(error));
	}
}

function* getReadyUser() {
	try {
		const response = yield call(getQueue);
		yield put(waitActions.setQueue(response));
	} catch (error) {
		yield put(waitActions.setError(error));
	}
}

export default function* watchWait() {
	yield takeLatest(waitActions.submitReady, getReadyUser);
	yield takeLatest(waitActions.submitTable, postWaitSaga);
}
