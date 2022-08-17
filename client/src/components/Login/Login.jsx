import React, { useState } from 'react'
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
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

<Form inline>
    <FormGroup className="mb-2 me-sm-2 mb-sm-0">
        <Label
            className="me-sm-2"
            for="exampleEmail"
        >
            Email
        </Label>
        <Input
            id="email"
            name="email"
            placeholder="email"
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
        />
    </FormGroup>
    <FormGroup className="mb-2 me-sm-2 mb-sm-0">
        <Label
            className="me-sm-2"
            for="examplePassword"
        >
            Password
        </Label>
        <Input
            id="password"
            name="password"
            placeholder="password"
            type="text"
            value={password}
            onChange={e => setPassword(e.target.value)}
        />
    </FormGroup>
    <Button type='submit'>
        Submit
    </Button>
</Form>
)
}

export default Login