import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga'
import { LoginSlice } from "../../features/LoginForm";

const sagaMiddleware = createSagaMiddleware()

const index = configureStore({
    reducer:{
        login: LoginSlice,
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
})

sagaMiddleware.run(rootSaga);
export default index