import './auth.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoginAction } from '../model/loginSlice';

const LoginFrom = () => {
	const [fio, setFio] = useState('');
	const [nickname, setNickname] = useState('');
	// const selector = useSelector(state => state.login.response);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const formData = {
		fio,
		nickname
	};

	const sendAuth = e => {
		e.preventDefault();
		if (nickname.trim().length > 3 || nickname.trim().length < 16) {
			dispatch(LoginAction.submitLogin(formData));
		} else {
			alert('нормальный ник сделай еже');
		}
	};

	// useEffect(() => {
	// 	console.log(selector);
	// 	if (!selector){
	// 		localStorage.setItem('nickname', nickname);
	// 		navigate('/chat');
	// 	}
	// }, [selector, navigate, nickname]);


	return (
		<>
			<form onSubmit={sendAuth}>
				<input
					className='login-input'
					type='text'
					placeholder='Имя'
					required
					onChange={e => setFio(e.target.value)}
				/>
				<input
					className='password'
					type='text'
					placeholder='nickname'
					required
					onChange={e => setNickname(e.target.value)}
				/>
				<button className='sendLogin' type='submit'>
					Войти
				</button>
			</form>
		</>
	);
};
export default LoginFrom;
