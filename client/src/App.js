import React, { useState, useEffect } from 'react'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import Router from './router';



function App() {

  const [ sessionToken, setSessionToken ] = useState(undefined)

  // Logout functionality
  const logout = () => {
    localStorage.clear()
 
  }

  return (
    <> 
      <nav>
     
        <button onClick={logout}>Logout</button>

      </nav>
      <Router />
    </>
  );
}

export default App;
