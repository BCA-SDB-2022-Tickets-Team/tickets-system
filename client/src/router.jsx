import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import CreateUser from './components/CU/createuser';
import Login from './components/Login/Login';
import NewTicket from './components/newTicket/NewTicket';
import AllTickets from './components/AllTickets/AllTickets';
import OneTicket from './components/OneTicket/OneTicket';

function Router() {
  const [sessionToken, setSessionToken] = useState(undefined)
  const [sessionRole, setSessionRole] = useState(undefined)
  const [ticketID, setTicketID] = useState("")

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setSessionToken(localStorage.getItem("token"))
    }
    if (localStorage.getItem("role")) {
      setSessionRole(localStorage.getItem("role"))
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
     <Route path="/" element={
        <Login 
          updateLocalStorageToken={updateLocalStorageToken}
          updateLocalStorageRole={updateLocalStorageRole} 
        />
      }
      />
       <Route 
          path="/createuser" 
          element={
            <CreateUser 
              sessionToken={sessionToken}
              sessionRole={sessionRole} 
            />
          }
        />
      <Route path='/newticket' element={<NewTicket />} />
      <Route path='/alltickets' element={<AllTickets setTicketID={setTicketID} />} />
      <Route path='/oneticket' element={<OneTicket ticketID={ticketID} />} />


    </Routes>
  )
}

export default Router
