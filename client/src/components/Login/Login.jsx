import React, { useState, useContext, useEffect } from 'react'
import { Form, FormGroup, Label, Input, Button, Container, Col, Row, Alert } from "reactstrap";
import { useNavigate, Navigate } from 'react-router-dom'
import { LoginContext } from '../../index';


import './Login.css'


function Login() {
    const { updateLocalStorageRole, updateLocalStorageToken, updateLocalStorageId, sessionToken } = useContext(LoginContext)
    // useState variables for username and password
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // useState variable for invalid credentials message
    const [displayError, setDisplayError] = useState(false)
    const [invalidMessage, setInvalidMessage] = useState(undefined)
    const navigate = useNavigate()
    // useEffect(() => {
    //     if(sessionToken !== null){
    //         navigate('/alltickets')
    //     }
    // }, [sessionToken])


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
                let serverErrorMessage = await res.json()
                console.log(serverErrorMessage)
                throw new Error(serverErrorMessage.status)
            } else {
                console.log('yay! good login!')
                const resData = await res.json()
                updateLocalStorageToken(resData.token)
                updateLocalStorageRole(resData.userRole)
                updateLocalStorageId(resData.userId)
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
            setInvalidMessage(err.message)
            setDisplayError(true)
            console.log(`error: ${err}`)
        }
    }
    return (
<Container fluid className="login-container">
<Row style={{ justifyContent: 'center' }}>
    <Alert
        isOpen={displayError}
        toggle={(e) => setDisplayError(false)}
        color="warning"
    >
        {invalidMessage}
    </Alert>
</Row>
<Row className="loginRow" style={{ justifyContent: 'center' }}>
<Col xs="2">

        <Form inline className="form"
            onSubmit={handleSubmit}>
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
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
             </FormGroup>
             <br></br>
             <Button className= "button" type='submit' xs="3">
                Login
            </Button>
          </Form>
        </Col>
        </Row>
       </Container>
       
    )
}

export default Login