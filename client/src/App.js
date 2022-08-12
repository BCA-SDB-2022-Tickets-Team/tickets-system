import React, { useState, useEffect } from 'react'
import './App.css';
import Login from './components/Login/Login';

function App() {

  const [ sessionToken, setSessionToken ] = useState(undefined)
  const [ sessionRole, setSessionRole ] = useState(undefined)

  //todo: ask Paul / Matt why we do this, and why we aren't just polling localStorage instead of passing sessionToken/sessionRole as a prop...
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setSessionToken(localStorage.getItem("token"))
    }
    if(localStorage.getItem("role")){
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
  const logout = () => {
    localStorage.clear()
    setSessionToken(undefined)
  }

  return (
    <> 
      <nav>
        <button onClick={logout}>Logout</button>
      </nav>
      <Login 
        updateLocalStorageToken={updateLocalStorageToken}
        updateLocalStorageRole={updateLocalStorageRole} 
      />
    </>
  );
}

export default App;
