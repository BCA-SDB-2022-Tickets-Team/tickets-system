import React, { useState } from 'react'
import './Login.css'

function Login() {
    // useState variables fro username and password
    const [username, setUsername] = useState("")
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
                <div className="username">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
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