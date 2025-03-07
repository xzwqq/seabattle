import './auth.scss';
// import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { LoginAction } from '../model/loginSlice';

const LoginFrom = () => {
	// const selector = useSelector(state => state.login.response);
	const dispatch = useDispatch();
	// const navigate = useNavigate();
	const [formData, setFormData] = useState({
		fio: '',
		nickname: ''
	});
	const handleChange = e => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const sendAuth = e => {
		e.preventDefault();
		const { nickname } = formData;
		if (nickname.trim().length > 3 && nickname.trim().length < 16) {
			dispatch(LoginAction.submitLogin(formData));
		} else {
			return alert('нормальный ник сделай еже');
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
					name='fio'
					required
					value={formData.fio}
					onChange={handleChange}
				/>
				<input
					className='password'
					type='text'
					placeholder='nickname'
					name='nickname'
					value={formData.nickname}
					required
					onChange={handleChange}
				/>
				<button className='sendLogin' type='submit'>
					Войти
				</button>
			</form>
		</>
	);
};
export default LoginFrom;
