import React, { useEffect } from 'react';
import { GameActions } from '../model/gameSlice';
import { useDispatch, useSelector } from 'react-redux';
import '../../../features/WaitDesk/ui/waitDesk.scss';

const GameForm = () => {
	const table = useSelector(state => state.game.table);
	const nickname = localStorage.getItem('nickname');
	const turn = useSelector(state => state.game.turn);
	const dispatch = useDispatch();

	const handleSubmit = (rowIndex, columnIndex, item, soso) => {
		const formdata = {
			targetNickname: soso,
			rowIndex,
			columnIndex
		};
		if (turn === nickname || item !== 2) {
			dispatch(GameActions.submitShoot(formdata));
		} else {
			alert('не твой ход братишка');
		}
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const getTable = () => {
		dispatch(GameActions.submitTable());
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const getTurn = () => {
		dispatch(GameActions.submitTurn());
	};

	useEffect(() => {
		const intervalTable = setInterval(getTable, 1000);
		const intervalTurn = setInterval(getTurn, 1000);
		return () => clearInterval(intervalTable, intervalTurn);
	}, [getTurn, getTable]);
	return (
		<div className='page'>
			<div className='turn'>{turn}</div>
			<div className='board'>
				{table.map((person, index) => {
					return (
						<div key={index} className='game-board'>
							{person.nickname}
							{person.coordinates.map((row, rowIndex) => {
								return (
									<div key={rowIndex} className='row'>
										{row.map((item, columnIndex) => {
											if (person.nickname === nickname) {
												return (
													<div
														key={columnIndex}
														className={item === 1 ? 'cell ship' : item === 3 ? 'cell miss' : 'cell' }
													>
														{item === 1 ? 'ship' : item === 3 ? 'miss' : ''}
													</div>
												);
											} else {
												return (
													<div
														key={columnIndex}
														onClick={() => handleSubmit(rowIndex, columnIndex, item, person.nickname)}
														className={item === 2 ? 'cell hit' : item === 3 ? 'cell miss' : 'cell'}
														data-text='x'
													>
														{item === 2 ? 'hit' : item === 3 ? 'miss' : ''}   
													</div>
												);
											}
										})}
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default GameForm;
