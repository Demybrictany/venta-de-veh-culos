import './App.css'
import { Routes, Route } from 'react-router-dom'
import Vehiculos from './pages/Vehiculos'

function App() {
  return (
    <Routes>
      <Route path="/vehiculos" element={<Vehiculos />} />
    </Routes>
  )
}

export default App