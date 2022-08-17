
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Button, Container, Row, Table, Col  } from "reactstrap";
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import { LoginContext } from '../../App';

import './createuser.css';

const departments = ["hr",
    "it",
    "legal",
    "manufacturing",
    "marketing",
    "ops",
    "procurement",]
const allowedRoles = [2, 4]



function CreateUser (props)  {

    const { sessionRole, sessionToken } = useContext(LoginContext)
    const [firstName, setFirst] = useState("")
    const [lastName, setLast] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [department, setdepartment] = useState("department")
    const [isManager, setIsManager] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [role, setRole] = useState(parseInt(sessionRole))
    const [allUsers, setAllUsers] = useState(undefined)
    const navigate = useNavigate()

    useEffect(()=>{
            setRole(parseInt(sessionRole))
            async function getAllUsers(){
                try {
                    let allUsersResponse = await fetch(`http://localhost:4000/api/user/allusers`, {
                        method: "GET",
                        headers: new Headers({
                            "Content-Type": "application/json",
                            "Authorization": sessionToken
                        })
                    })
                    if(allUsersResponse.ok){
                        console.log(`allusers response:`, allUsersResponse)
                        await allUsersResponse.json()
                            .then(data => {
                                console.log(data)
                                setAllUsers(data.allUsers)
                            })
                            .catch(err => console.log(err))
                    } else {
                        let errorMsg = await allUsersResponse.json()
                        console.log(`error getting /allusers: `, allUsersResponse)
                        throw new Error(errorMsg.status)
                    }
                } catch (error) {
                    console.log(`awww shucks: `, error)
                }   
            }
            getAllUsers()
        // }
    },
    [])

    const toggle = () => setDropdownOpen((prevState) => !prevState);

    const onChangeHndler = (e, setter) => {
        setter(e.target.value)
    }

    const handleSubmit = e => {
        e.preventDefault()
        let newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }
        if (role === 2) {
            newUser["Department"] = department
            newUser["isManager"] = isManager
        } else { newUser["isAdmin"] = isAdmin }

        let url = `http://localhost:4000/api/user/${role === 2 ? "req" : "asr"}`
        fetch(url, {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": sessionToken
            })
        })
            .then(res => res.json())
            .then(data => console.log(data))
    }
    return (
      <Container fluid className='create-user-container'>
        <Row className="create-user-row">
            <Col xs="8">
                <Table responsive striped>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>E-mail</th>
                            <th>Department</th>
                            <th>Admin?</th>
                            {
                                role === 4 ?
                                    <th>User Type</th>
                                :
                                null
                            }
                        </tr>
                    </thead>
                    <tbody>
                        { allUsers !== undefined ?
                            allUsers.map(user => {
                                return (
                                    <tr key={user._id}>
                                        <th scope="row">
                                            {user._id}
                                        </th>
                                        <td>
                                            {user.firstName}
                                        </td>
                                        <td>
                                            {user.lastName}
                                        </td>
                                        <td>
                                            {user.email}
                                        </td>
                                        <td>
                                            {user.Department !== undefined ? user.Department : `n/a`}
                                        </td>
                                        <td>
                                            {user.isManager !== undefined ? 
                                                `${user.isManager}`
                                                :
                                                `${user.isAdmin}`
                                            }
                                        </td>
                                        { 
                                            role === 4 ? 
                                                <td>
                                                    {user.__type}
                                                </td>
                                            :
                                                null
                                        }
                                    </tr>
                                )
                            })
                            : 
                            null
                        }
                    </tbody>
                </Table>
            </Col>
            <Col 
                className='sidePanel'
                xs="2"
            >
                <div className="FormContainer">
                    <Form 
                        className="form" 
                        inline
                        onSubmit={handleSubmit}>
                        <FormGroup className="mb-2 me-sm-2 mb-sm-0" >
                            <Label
                                className="me-sm-2"
                                for="exampleEmail"
                            >
                                First Name
                            </Label>
                            <Input
                                id="First Name"
                                name="first name"
                                type="name"
                                onChange={(e) => onChangeHndler(e, setFirst)}
                            />
                        </FormGroup>
                        <FormGroup className="mb-2 me-sm-2 mb-sm-0" >
                            <Label
                                className="me-sm-2"
                                for="examplePassword"
                            >
                                Last Name
                            </Label>
                            <Input
                                id="Last Name"
                                name="last name"
                                type="last name"
                                onChange={(e) => onChangeHndler(e, setLast)}
                            />
                        </FormGroup>
                        <FormGroup className="mb-2 me-sm-2 mb-sm-0" >
                            <Label
                                className="me-sm-2"
                                for="examplePassword"
                            >
                                Email
                            </Label>
                            <Input
                                id="Email"
                                name="email"
                                type="email"
                                onChange={(e) => onChangeHndler(e, setEmail)}
                            />
                        </FormGroup>

                        <FormGroup className="mb-2 me-sm-2 mb-sm-0" >
                            <Label
                                className="me-sm-2"
                                for="examplePassword"
                            >
                                Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                onChange={(e) => onChangeHndler(e, setPassword)}
                            />
                        </FormGroup>
                        <div className="d-flex p-5">
                            {role === 2 ?
                                <Dropdown toggle={toggle} direction={"down"} isOpen={dropdownOpen}>
                                    <DropdownToggle caret>
                                        {department}
                                    </DropdownToggle>
                                    <DropdownMenu container="body">
                                        {departments.map(department => {
                                            return (
                                                <DropdownItem onClick={() => setdepartment(department)}>
                                                    {department}
                                                </DropdownItem>
                                            )
                                        })}
                                    </DropdownMenu>
                                </Dropdown>
                                :
                                null
                            }
                        </div>

                        <br></br>
                        <FormGroup className="checkbox"
                            check
                            inline
                        > 
                        {role === 2 ?
                        <>
                            <Input type="checkbox" onClick={() => setIsManager(!isManager)} />
                            <Label check>
                                Is Manager
                            </Label>
                            </>
                                :
                                <> <Input type="checkbox" onClick={() => setIsAdmin(!isAdmin)} />
                                <Label check>
                                    Is Admin
                                </Label></>
                            }
                        </FormGroup>
                        <Button type='submit'>
                            Submit
                        </Button>
                    </Form>
                    
                </div>
            </Col>
        </Row>
    </Container>
    );

}


export default CreateUser
