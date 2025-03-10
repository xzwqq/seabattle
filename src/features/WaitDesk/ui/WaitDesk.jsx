import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { waitActions } from '../model/waitSlices.js';
import { useNavigate } from 'react-router-dom';
import './waitDesk.scss';

const WaitDesk = () => {
	const nickname = localStorage.getItem('nickname');
	const countReady = useSelector(state => state.wait.queue);
	const navigate = useNavigate()
	const dispatch = useDispatch();
	const [message, setMessage] = useState('');
	const [count, setCount] = useState(0);
	const [formData, setFormData] = useState({
		nickname: nickname,
		coordinates: [
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0]
		]
	});

	const isNeighborSafe = (coordinates, rowIndex, cellIndex) => {
		const directions = [
			[-1, -1],[-1, 0],[-1, 1],
			[0, -1],		 [0, 1],
			[1, -1], [1, 0], [1, 1]
		];

		for (const [dx, dy] of directions) {
			const newRow = rowIndex + dx;
			const newCol = cellIndex + dy;
			if (
				newRow >= 0 &&
				newRow < coordinates.length &&
				newCol >= 0 &&
				newCol < coordinates[0].length
			) {
				if (coordinates[newRow][newCol] === 1) {
					setMessage('сюда нельзя');
					return false;
				}
			}
		}
		return true;
	};

	const handleChange = (rowIndex, cellIndex) => {
		setMessage('');
		if (count >= 5) {
			return setMessage('Максимальное количество кораблей: 5');
		}

		const newTable = [...formData.coordinates];
		const row = [...newTable[rowIndex]];

		if (row[cellIndex] === 0 && isNeighborSafe(formData.coordinates, rowIndex, cellIndex)) {
			row[cellIndex] = 1;
			newTable[rowIndex] = row;
			setFormData({ ...formData, coordinates: newTable });
			setCount(count + 1);
		} else if (row[cellIndex] === 1) {
			row[cellIndex] = 0;
			newTable[rowIndex] = row;
			setFormData({ ...formData, coordinates: newTable });
			setCount(count - 1);
		}
	};

	const handleSubmit = e => {
		e.preventDefault();
		dispatch(waitActions.submitTable(formData));
	};
	useEffect(() =>{
		if(countReady === 3){
			navigate('/game')
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[countReady])

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const ready = () => {
		dispatch(waitActions.submitReady());
	};

	useEffect(() => {
		const interval = setInterval(ready, 1000);
		return () => clearInterval(interval);
	}, [ready]);

	return (
		<div>
			<div className='countReady'>
				<p>{countReady}/3 игроков готов!</p>
			</div>
			<div className='desk'>
				<div className='game-board'>
					{formData.coordinates.map((row, rowIndex) => (
						<div key={rowIndex} className='row'>
							{row.map((item, cellIndex) => {
								return (
									<div
										key={cellIndex}
										onClick={() => handleChange(rowIndex, cellIndex)}
										className={item === 1 ? 'cell ship' : 'cell'}
										data-text='x'
									>
										{item === 1 ? 'ship' : ''}
									</div>
								);
							})}
						</div>
					))}
				</div>
			</div>
			<form onSubmit={handleSubmit}>
				<button disabled={count < 5}>Готово</button>
			</form>
			<div className='message-error'>
				<p>{message}</p>
			</div>
		</div>
	);
};

export default WaitDesk;
