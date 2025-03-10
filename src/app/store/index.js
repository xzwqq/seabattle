import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './rootSaga';
import { loginSlices } from '../../features/LoginForm';
import { waitSlice } from '../../features/WaitDesk';
import { gameSlice } from '../../widgets/GameForm';

const sagaMiddleware = createSagaMiddleware();

const index = configureStore({
	reducer: {
		login: loginSlices,
		wait: waitSlice,
		game: gameSlice,
	},

	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(sagaMiddleware)
});

sagaMiddleware.run(rootSaga);

export default index;
