import React, { useState, useEffect } from 'react'
import './App.css';
import Login from './components/Login/Login';


function App() {

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
  const logout = () => {
    localStorage.clear()
    setSessionToken(undefined)
  }

  return (
    <> 
      <nav>
        <button onClick={logout}>Logout</button>
      </nav>
      <Login updateLocalStorage={updateLocalStorage} />
    </>
  );
}

export default App;
