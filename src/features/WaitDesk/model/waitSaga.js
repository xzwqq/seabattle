import { call, put, takeLatest } from 'redux-saga/effects';
import { waitActions } from './waitSlices.js';

function* postWaitSaga(action) {
	try {
		const response = yield call(action.payload);
		yield put(waitActions.setQueue(response));
	} catch (error) {
		yield put(waitActions.setError(error));
	}
}

export default function* watchWait() {
    yield takeLatest(waitActions.submitReady,)
    yield takeLatest(waitActions.submitTable, postWaitSaga)
}