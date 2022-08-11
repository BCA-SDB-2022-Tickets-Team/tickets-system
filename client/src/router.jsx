import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './components/Login/Login';
import { useEffect } from 'react';
import { useState } from 'react';

function Router() {
    const [ sessionToken, setSessionToken ] = useState(undefined)

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setSessionToken(localStorage.getItem("token"))
    }
  })

  const updateLocalStorage = newToken => {
    localStorage.setItem("token", newToken)
    setSessionToken(newToken)
  }

  // Logout functionality
  return (
   <Routes >
       <Route path="/" element={<Login updateLocalStorage={updateLocalStorage} />}/>
           
       
   </Routes>
  )
}

export default Router