import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga';
import { loginSlice } from '../../features/LoginForm/index';

const sagaMiddleware = createSagaMiddleware();

const index = configureStore({
	reducer: {
		login: loginSlice,
	},

	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware)
});

sagaMiddleware.run(rootSaga);

export default index;
