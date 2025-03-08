import { unstable_HistoryRouter as HistoryRouter, Routes, Route } from 'react-router-dom';
import { history } from './providers/history.js';
import Login from '../page/Login/Login.jsx'
import Wait from '../page/Wait/Wait.jsx'
import './style/App.scss'

function App() {

  return (
    <HistoryRouter history={history}>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/wait' element={<Wait/>}/>
      </Routes>
      </HistoryRouter>
  )
}

export default App
