import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga';
import { loginSlice } from '../../features/LoginForm';
import { waitSlice } from '../../features/WaitDEsk';

const sagaMiddleware = createSagaMiddleware();

const index = configureStore({
	reducer: {
		login: loginSlice,
        wait: waitSlice
	},

	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware)
});

sagaMiddleware.run(rootSaga);

export default index;
