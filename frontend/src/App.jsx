import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home'
import Login from './pages/Login';
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
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>} />
        <Route path='/civs' element={<ProtectedRoute><Civs/></ProtectedRoute>} />
        <Route path='/units' element={<ProtectedRoute><Units/></ProtectedRoute>} />
        <Route path='/civs/create' element={<ProtectedRoute><CreateCiv/></ProtectedRoute>} />
        <Route path='/units/create' element={<ProtectedRoute><CreateUnit/></ProtectedRoute>} />
        <Route path='/civs/details/:id' element={<ProtectedRoute><ShowCiv/></ProtectedRoute>} />
        <Route path='/units/details/:id' element={<ProtectedRoute><ShowUnit/></ProtectedRoute>} />
        <Route path='/civs/edit/:id' element={<ProtectedRoute><EditCiv/></ProtectedRoute>} />
        <Route path='/units/edit/:id' element={<ProtectedRoute><EditUnit/></ProtectedRoute>} />
        <Route path='/units/delete/:id' element={<ProtectedRoute><DeleteUnit/></ProtectedRoute>} />
        <Route path='/civs/delete/:id' element={<ProtectedRoute><DeleteCiv/></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  )
}

export default App