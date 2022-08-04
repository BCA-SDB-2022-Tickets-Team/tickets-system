import React, { useState } from 'react'
import './Login.css'

function LoginREQ() {

    // useState variables for username and password
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // useState variable for invalid credentials message
    const [display, setDisplay] = useState({ display: "none" })

    async function handleSubmit(e) {

        e.preventDefault()

        const payload = JSON.stringify({
            email: email,
            password: password
        })

        try {
            const res = await fetch("http://localhost/api/req/login", payload)

            if (!res.ok) {
                setDisplay({ display: "inline" }) // Show invalid credentials message
                throw new Error(res.JSON.status)
            }

            const resData = await res.JSON()
            //resData.token =

        } catch (err) {

        }
    }


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
                <button onClick={handleSubmit} type="submit">Login</button>
                <div style={display}>Invalid Credentials!</div>
            </form>
        </div>
    )
}

export default LoginREQ