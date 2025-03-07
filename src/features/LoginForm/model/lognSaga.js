import {call, put, takeLatest} from 'redux-saga/effects'
import { LoginAction } from './loginSlice'
import {postUser} from '../../../shared/api/loginApi.js'

function* submit(action) {
    try{
        const response = yield call(postUser,action.payload)
        yield put(LoginAction.setResponse(response))
    }catch(response){
        yield put(LoginAction.setError(response))
    }
}

export default function* watchLogin(){
    yield takeLatest(LoginAction.submitLogin, submit)
}