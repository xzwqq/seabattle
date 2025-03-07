import {all} from 'redux-saga/effects';
import {watchLogin} from '../../features/LoginForm/index'

export default function* rootSaga() {
    yield all([
        watchLogin(),
    ])
}