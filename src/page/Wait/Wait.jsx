import React from 'react';
import { WaitDesk } from '../../features/WaitDesk';

const Wait = () => {
	return (
		<div className='Wait'>
			<div className='txt-wait'>
				<h2>Расставь 5 корбаликов</h2>
			</div>
			<WaitDesk />
		</div>
	);
};

export default Wait;
