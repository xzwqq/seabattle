import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { waitActions } from '../model/waitSlices.js';
import { useNavigate } from 'react-router-dom';
import './waitDesk.scss';

const WaitDesk = () => {
  const countReady = useSelector(state => state.wait.queue);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(0);
  const [formData, setFormData] = useState({
    coordinates: Array(5).fill().map(() => Array(7).fill(0))
  });

  const isNeighborSafe = (coordinates, rowIndex, cellIndex) => {
    const directions = [
      [-1, -1],[-1, 0],[-1, 1],
      [0, -1], [0, 1],
      [1, -1],[1, 0],[1, 1]
    ];

    return directions.every(([dx, dy]) => {
      const newRow = rowIndex + dx;
      const newCol = cellIndex + dy;
      return !(
        newRow >= 0 &&
        newRow < coordinates.length &&
        newCol >= 0 &&
        newCol < coordinates[0].length &&
        coordinates[newRow][newCol] === 1
      );
    });
  };

  const handleCellClick = (rowIndex, cellIndex) => {
    setMessage('');
    
    if (count >= 5) {
      return setMessage('Максимальное количество кораблей: 5');
    }

    const newCoordinates = formData.coordinates.map(row => [...row]);
    
    if (newCoordinates[rowIndex][cellIndex] === 0) {
      if (!isNeighborSafe(newCoordinates, rowIndex, cellIndex)) {
        return setMessage('Сюда нельзя размещать корабли рядом');
      }
      
      newCoordinates[rowIndex][cellIndex] = 1;
      setCount(count + 1);
    } else {
      newCoordinates[rowIndex][cellIndex] = 0;
      setCount(count - 1);
    }

    setFormData({ coordinates: newCoordinates });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (count < 5) {
      return setMessage('Нужно разместить все 5 кораблей');
    }
    dispatch(waitActions.submitTable(formData.coordinates));
  };

  useEffect(() => {
    if (countReady === 3) {
      navigate('/game');
    }
  }, [countReady, navigate]);

  return (
    <div className="wait-container">
      <div className='countReady'>
        <p>{countReady}/3 игроков готовы!</p>
      </div>
      
      <div className='desk'>
        <div className='game-boards'>
          {formData.coordinates.map((row, rowIndex) => (
            <div key={rowIndex} className='row'>
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  onClick={() => handleCellClick(rowIndex, cellIndex)}
                  className={`cell ${cell === 1 ? 'ship' : ''}`}
                >
                  {cell === 1 ? '■' : ''}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <button 
          type="submit" 
          className='onready' 
          disabled={count < 5}
        >
          Готово ({count}/5)
        </button>
      </form>
      
      {message && <div className='message-error'>{message}</div>}
    </div>
  );
};

export default WaitDesk;