import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Civs from './pages/Civs'
import Units from './pages/Units'
import CreateCiv from './pages/CreateCiv'
import CreateUnit from './pages/CreateUnit'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/civs' element={<Civs/>} />
      <Route path='/units' element={<Units/>} />
      <Route path='/civs/create' element={<CreateCiv/>} />
      <Route path='/units/create' element={<CreateUnit/>} />
    </Routes>
  )
}

export default App