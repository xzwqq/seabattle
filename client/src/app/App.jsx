import { unstable_HistoryRouter as HistoryRouter, Routes, Route } from 'react-router-dom';
import { history } from './providers/history.js';
import Login from '../page/Login/Login.jsx'
import Wait from '../page/Wait/Wait.jsx'
import Game from '../page/Game/Game.jsx'
import './style/App.scss'
import { client } from './socket/socket.js';

  client
function App() {
  
  return (
    <HistoryRouter history={history}>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/wait' element={<Wait/>}/>
        <Route path='/game' element={<Game/>}/>
      </Routes>
      </HistoryRouter>
  )
}

export default App
