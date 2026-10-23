import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Vehiculos from './pages/Vehiculos'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/vehiculos" replace />} />
      <Route path="/vehiculos" element={<Vehiculos />} />
      <Route path="*" element={<Navigate to="/vehiculos" replace />} />
    </Routes>
  )
}

export default App