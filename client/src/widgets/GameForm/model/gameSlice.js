import { createAction, createSlice } from "@reduxjs/toolkit";


const gameSlice = createSlice({
    name: 'game',
    initialState: {
        table: [],
        shoot: [],
        turn: 'isLoading...',
        error: null,
    },
    reducers:{
        setTable: (state, action) =>{
            state.table = action.payload 
        },
        setTurn: (state, action) =>{
            state.turn = action.payload
        },
        setShoot: (state, action) =>{
            state.shoot = action.payload
        },
        setError : (state, action) =>{
            state.error = action.payload
        }
    }
})
export const GameActions ={
    ...gameSlice.actions,
    submitTable: createAction(`${gameSlice.name}/submitTable`),
    submitTurn: createAction(`${gameSlice.name}/submitTurn`),
    submitShoot: createAction(`${gameSlice.name}/submitShoot`),
}
export default gameSlice.reducer