import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Civs from './pages/Civs/Civs'
import Units from './pages/Units/Units'
import CreateCiv from './pages/Civs/CreateCiv'
import CreateUnit from './pages/Units/CreateUnit'
import Navbar from './components/Navbar'
import ShowUnit from './pages/Units/ShowUnit'
import ShowCiv from './pages/Civs/ShowCiv'
import EditUnit from './pages/Units/EditUnit';
import EditCiv from './pages/Civs/EditCiv';
import DeleteUnit from './pages/Units/DeleteUnit';
import DeleteCiv from './pages/Civs/DeleteCiv';

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
        <Route path='/civs/delete/:id' element={<DeleteCiv/>} />
      </Routes>

    </div>
  )
}

export default App