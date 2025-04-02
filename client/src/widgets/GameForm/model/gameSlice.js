import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: 'connecting', // 'waiting' | 'playing' | 'finished'
  gameState: null,
  winner: null,
  winnerName: '',
  error: null
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    updateGameState: (state, action) => {
      state.gameState = action.payload;
      state.status = action.payload.gameStarted ? 'playing' : 'waiting';
      state.error = null;
    },
    gameOver: (state, action) => {
      state.status = 'finished';
      state.winner = action.payload.winner;
      state.winnerName = action.payload.winnerName;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetGame: () => initialState
  }
});

export const GameActions = gameSlice.actions;
export default gameSlice.reducer;