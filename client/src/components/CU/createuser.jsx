
import React, { useState, useEffect } from 'react';
import { Table } from "reactstrap";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';

import './createuser.css';

const departments = ["hr",
    "it",
    "legal",
    "manufacturing",
    "marketing",
    "ops",
    "procurement",]




function CreateUser (props)  {


    const [firstName, setFirst] = useState("")
    const [lastName, setLast] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [department, setdepartment] = useState("department")
    const [isManager, setIsManager] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [role, setRole] = useState(undefined)
useEffect(()=>{
    setRole(localStorage.getItem("role"))
    console.log(role)},[])

    const toggle = () => setDropdownOpen((prevState) => !prevState);

    const handleSubmit = e => {
        e.preventDefault()
        let newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }
        if (role === 2) {
            newUser["department"] = department
            newUser["isManager"] = isManager
        } else { newUser["isAdmin"] = isAdmin }

        let url = `http://localhost:4000/api/user/${role === 2 ? "req" : "asr"}`
        fetch(url, {
            method: "POST",
            body: JSON.stringify(newUser),
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": props.sessionToken
            })
        })
            .then(res => res.json())
            .then(data => console.log(data))
    }
    return (

        <div style={{
            display: 'block', width: 700, padding: 30
        }}>
            <Table
            >
                <thead>
                    <tr>
                        <th>
                            #
                        </th>
                        <th>
                            First Name
                        </th>
                        <th>
                            Last Name
                        </th>
                        <th>
                            Department
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">
                            1
                        </th>
                        <td>
                            {firstName}
                        </td>
                        <td>
                            {lastName }
                        </td>
                        <td>
                            {lastName}
                        </td>
                        <td>
                            {email}
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            2
                        </th>
                        <td>
                            Jacob
                        </td>
                        <td>
                            Thornton
                        </td>
                        <td>
                            @fat
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            3
                        </th>
                        <td>
                            Larry
                        </td>
                        <td>
                            the Bird
                        </td>
                        <td>
                            @twitter
                        </td>
                    </tr>
                </tbody>
            </Table>
            <div className="FormContainer">
                <Form inline>
                    <FormGroup className="mb-2 me-sm-2 mb-sm-0">
                        <Label
                            className="me-sm-2"
                            for="exampleEmail"
                        >
                            First Name
                        </Label>
                        <Input
                            id="exampleName"
                            name="email"
                            type="email"
                        />
                    </FormGroup>
                    <FormGroup className="mb-2 me-sm-2 mb-sm-0">
                        <Label
                            className="me-sm-2"
                            for="examplePassword"
                        >
                            Last Name
                        </Label>
                        <Input
                            id="examplePassword"
                            name="password"
                            type="password"
                        />
                    </FormGroup>
                    <FormGroup className="mb-2 me-sm-2 mb-sm-0">
                        <Label
                            className="me-sm-2"
                            for="examplePassword"
                        >
                            Email
                        </Label>
                        <Input
                            id="examplePassword"
                            name="password"

                            type="password"
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
                            id="examplePassword"
                            name="password"
                            type="password"
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
                                        return (<DropdownItem onClick={() => setdepartment(department)}>
                                            {department}
                                        </DropdownItem>)
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
                        <Input type="checkbox" onClick={() => setIsManager(!isManager)} />
                        <Label check>
                            Is Manager
                        </Label>
                        <Input type="checkbox" onClick={() => setIsAdmin(!isManager)} />
                        <Label check>
                            Is Admin
                        </Label>
                    </FormGroup>



                    <Button>
                        Submit
                    </Button>
                </Form>

            </div>
        </div>

    );

}


export default CreateUser
