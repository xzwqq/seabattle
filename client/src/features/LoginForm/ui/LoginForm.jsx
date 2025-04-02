import './auth.scss';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { LoginAction } from '../model/loginSlices';

const LoginFrom = () => {
	const dispatch = useDispatch();
	const [nickname, setFormData] = useState('');

	

	const sendAuth = e => {
		e.preventDefault();
		if (nickname.trim().length > 3 && nickname.trim().length < 16) {
			dispatch(LoginAction.submitLogin(nickname));
		} else {
			return alert('нормальный ник сделай еже');
		}
	};

	return (
		<>
			<form onSubmit={sendAuth}>
				<input
					className='password'
					type='text'
					placeholder='nickname'
					name='nickname'
					value={nickname}
					required
					onChange={(e) => setFormData(e.target.value)}
				/>
				<button className='sendLogin' type='submit'>
					Войти
				</button>
			</form>
		</>
	);
};
export default LoginFrom;
