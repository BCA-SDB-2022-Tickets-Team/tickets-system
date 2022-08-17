import React, { useState } from 'react'
import { Link} from 'react-router-dom'
import './Login.css'


function Login(props) {

    // useState variables for username and password
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // useState variable for invalid credentials message
    const [display, setDisplay] = useState({ display: "none" })


    async function handleSubmit(e) {
        e.preventDefault()
        console.log('handle submit fired')

        const payload = JSON.stringify({
            email: email,
            password: password
        })

        try {
            const res = await fetch("http://localhost:4000/api/user/login", {
                method: "POST",
                body: payload,
                headers: new Headers({
                    "Content-Type": "application/json"
                })
            })

            if (!res.ok) {
                console.log(`oh no bad login!`)
                setDisplay({ display: "inline" }) // Show invalid credentials message
                throw new Error(res.JSON.status)
            } else {
                console.log('yay! good login!')
                const resData = await res.json()
                props.updateLocalStorageToken(resData.token)
                props.updateLocalStorageRole(resData.userRole)
        
                // ? example of authenticated request to the server
                // const testRes = await fetch("http://localhost:4000/api/req/test", {
                //     method: "GET",
                //     headers: new Headers({
                //         "Content-Type": "application/json",
                //         "Authorization": `Bearer ${localStorage.getItem('token')}`
                //     })
                // })
                // if(!testRes.ok){
                //     if(testRes.status === 403){
                //        //user does not have sufficident permissions, redirect to either login page or home 
                //     }
                // } else {
                //     console.log('authenticated request!')
                // }
            }
        } catch (err) {
            console.log(`error: ${err}`)
        }
    }


    return (
        <div>
            <form className="formWrapper" action="" onSubmit={handleSubmit}>
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
                <button type="submit">Login</button>
                <div style={display}>Invalid Credentials!</div>
            </form>
            <Link to="/createUser">Create User</Link>

        </div>
    )
}

export default Login