import { all } from 'redux-saga/effects';
import { watchLogin } from '../../features/LoginForm/index';
import { watchWait } from '../../features/WaitDesk';
import { watchGame } from '../../widgets/GameForm/index';

export default function* rootSaga() {
	yield all([
		watchLogin(),
		watchWait(),
		watchGame()
		]);
}
