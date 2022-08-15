import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import CreateUser from './components/CU/createuser';
import Login from './components/Login/Login';
import NewTicket from './components/NewTicket/NewTicket';
import ViewUpdate from './components/VU/viewupdate';

function Router() {
    const [ sessionToken, setSessionToken ] = useState(undefined)
    const [ sessionRole, setSessionRole ] = useState(undefined)

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setSessionToken(localStorage.getItem("token"))
    }
  })

  const updateLocalStorageToken = newToken => {
    localStorage.setItem("token", newToken)
    setSessionToken(newToken)
  }

  const updateLocalStorageRole = newRoleId => {
    localStorage.setItem("role", newRoleId)
    setSessionRole(newRoleId)
  }


  // Logout functionality
  return (
   <Routes >
       <Route path="/" element={<Login updateLocalStorageToken={updateLocalStorageToken} updateLocalStorageRole={updateLocalStorageRole} />}/>
       <Route path="/createuser" element={<CreateUser />}/>
       <Route path="/VU" element={<ViewUpdate />} />
       <Route path='newticket' element={<NewTicket />}/>


   </Routes>
  )
}

export default Router
