import { Routes, Route } from 'react-router-dom'
import Login from '../page/Login/Login.jsx'
import './style/App.scss'

function App() {

  return (
      <Routes>
        <Route path='/' element={<Login/>}/>
      </Routes>
  )
}

export default App
