import React, { useState, useEffect, createContext, useContext } from 'react'
import { Nav, NavItem, NavLink } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';
import Router from './router';

export const LoginContext = createContext()

function GlobalNav() {
  const {logoutAndClearSession} = useContext(LoginContext)
  const navigate = useNavigate()
  const logout = (e) => {
    e.preventDefault()
    logoutAndClearSession()
    navigate('/')
  }
  return (
    <Nav tabs>
      <NavItem>
        <NavLink 
          onClick={logout}
          href="#"
        > 
          Logout 
        </NavLink>
      </NavItem>
    </Nav>
  )
}


function App() {
  const [sessionToken, setSessionToken] = useState(undefined)
  const [sessionRole, setSessionRole] = useState(undefined)

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setSessionToken(localStorage.getItem("token"))
    } else {
      setSessionToken(undefined)
    }
    if (localStorage.getItem("role")) {
      setSessionRole(localStorage.getItem("role"))
    } else {
      setSessionRole(undefined)
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

  const logoutAndClearSession = () => {
    localStorage.clear()
    setSessionRole(undefined)
    setSessionToken(undefined)
  }
  return (
    <LoginContext.Provider value={{
      sessionToken,
      sessionRole,
      updateLocalStorageToken,
      updateLocalStorageRole,
      logoutAndClearSession
    }}> 
      <GlobalNav />
      <Router />
    </LoginContext.Provider>
  );
}

export default App;
