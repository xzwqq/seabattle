import { Routes, Route } from 'react-router-dom'
import Login from '../page/Login/Login.jsx'
import Wait from '../page/Wait/Wait.jsx'
import './style/App.scss'

function App() {

  return (
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/wait' element={<Wait/>}/>
      </Routes>
  )
}

export default App
