import {call, put, takeLatest} from 'redux-saga/effects'
import { LoginAction } from './LoginSlice'

function* submit(action) {
    try{
        const response = yield call(action.payload)
        yield put(LoginAction.setResponse(response))
    }catch(response){
        yield put(LoginAction.setError(response))
    }
}

export default function* watchLogin(){
    yield takeLatest(LoginAction.submitLogin, submit)
}