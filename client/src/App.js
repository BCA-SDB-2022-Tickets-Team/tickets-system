import React, { useState, useEffect } from 'react'
import './App.css';
import Router from './router';


function App() {

 
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
