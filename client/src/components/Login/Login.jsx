import React, { useState } from 'react'
import './Login.css'

function Login() {
    // useState variables fro username and password
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    /* const handleSubmit = e => {
        e.preventDefault()

        fetch("http://localhost:4000/api/auth/login", {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        })
            .then(res => res.json())
            .then(data => { props.updateLocalStorage(data.token); console.log(data) })
            .catch(err => console.log(err))
    } */

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
                <button type="submit" >Login</button> {/*onClick={handleSubmit}*/}
            </form>
        </div>
    )
}

export default Login