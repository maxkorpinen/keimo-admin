import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Civs from './pages/Civs'
import Units from './pages/Units'
import CreateCiv from './pages/CreateCiv'
import CreateUnit from './pages/CreateUnit'
import Navbar from './components/Navbar'
import ShowUnit from './pages/ShowUnit'
import ShowCiv from './pages/ShowCiv'
import EditUnit from './pages/EditUnit';
import EditCiv from './pages/EditCiv';
import DeleteUnit from './pages/DeleteUnit';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/civs' element={<Civs/>} />
        <Route path='/units' element={<Units/>} />
        <Route path='/civs/create' element={<CreateCiv/>} />
        <Route path='/units/create' element={<CreateUnit/>} />
        <Route path='/civs/details/:id' element={<ShowCiv/>} />
        <Route path='/units/details/:id' element={<ShowUnit/>} />
        <Route path='/civs/edit/:id' element={<EditCiv/>} />
        <Route path='/units/edit/:id' element={<EditUnit/>} />
        <Route path='/units/delete/:id' element={<DeleteUnit/>} />
      </Routes>

    </div>
  )
}

export default App