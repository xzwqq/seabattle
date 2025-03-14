import { call, put, takeLatest } from "redux-saga/effects";
import { GameActions } from "./gameSlice";
import {getTableApi, getTrunApi, postShootApi} from '../../../shared/api/gameApi'

function* getCoordinates(){
    try{
        const response = yield call(getTableApi)
        yield put(GameActions.setTable(response))
    }catch(error){
        yield put(GameActions.setError(error))
    }
}

function* getTurn() {
    try{
        const response = yield call(getTrunApi)
        yield put(GameActions.setTurn(response))
    }catch(error){
        yield put(GameActions.setError(error))
    }
}
function* postShoot(action) {
    try{
        const response = yield call(postShootApi, action.payload)
        yield put(GameActions.setShoot(response))
    }catch(error){
        yield put(GameActions.setError(error))
    }
}

export function* watchGame() {
    yield takeLatest(GameActions.submitTable, getCoordinates)
    yield takeLatest(GameActions.submitTurn, getTurn)
    yield takeLatest(GameActions.submitShoot, postShoot)
}