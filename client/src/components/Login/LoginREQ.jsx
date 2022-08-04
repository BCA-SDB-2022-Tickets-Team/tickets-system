import React, { useState } from 'react'
import { createDispatchHook } from 'react-redux'
import './Login.css'

function LoginREQ() {
    // useState variables for username and password
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [show, setShow] = useState(false)
//hello
   async function handleSubmit(e) {
        e.preventDefault()
    const payload = JSON.stringify({
        email: email,
        password: password
    })
    try {
     const res = await fetch("http://localhost/api/req/login", payload)
     if (!res.ok) {
        throw new Error(res.JSON.status)
        setShow(!show);
    
      const messageStyle = {
        display: show ? "inline" : "none",
      };
     }
     const resData = await res.JSON()
     //resData.token =
    } catch(err) {

    }}


    return (
        <div>
            <form className="formWrapper" action="">
                <div className="email">
                    <label htmlFor="email">Username:</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
        

                <div className="password">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Login</button> {/*onClick={handleSubmit}*/}
                <div style={messageStyle}>Invalid Credentials!</div>
            </form>
        </div>
    )
}

export default LoginREQ