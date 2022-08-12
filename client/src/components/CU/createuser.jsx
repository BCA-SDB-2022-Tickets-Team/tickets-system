import React, { useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import './createuser.css'

const roles =[   "hr",
"it",
"legal",
"manufacturing",
"marketing",
"ops",
"procurement",]


export const CreateUser = (props) => {

   
    const [firstName, setFirst] = useState("")
    const [lastName, setLast] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("")
    const [isManager, setIsManager] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)


  const handleSubmit = e => {
      e.preventDefault()
      let url = "http://localhost:4000/api/user/createuser"
      fetch(url, {
          method:"POST",
          body: JSON.stringify({
              firstName: firstName,
              lastName: lastName,
              email: email,
              password: password,
              role: role,
              isManager: false,
              isAdmin: false
      
          }),
          headers: new Headers({
              "Content-Type": "application/json",
              "Authorization": props.sessionToken
          })
      })
      .then(res => res.json())
      .then(data => console.log(data))
      
      //alert(`Name: ${firstName} ${lastName}, email: ${email}, password: ${password}, role: ${role}, Manager: ${isManager}, Admin: ${isAdmin}`)

  }


    return (
    
        <div>
            <form className="createUserWrapper" onSubmit={handleSubmit}>
            <div className="firstName">
                    <label htmlFor="firstname">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={e => setFirst(e.target.value)}
                    />
                </div>
            <div className="lastName">
                    <label htmlFor="lastname">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={e => setLast(e.target.value)}
                    />
                </div>
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
                
      <DropdownButton title={role||"role"} id="dropdown-basic">
          
      {roles.map(item=>(<Dropdown.Item key={item} onClick={()=>setRole(item)}>{item}</Dropdown.Item>))}
      </DropdownButton>

      <InputGroup className="mb-3">
        <InputGroup.Checkbox id="ismanager" onClick={()=>setIsManager(!isManager)} aria-label="Checkbox for following text input" />
        <Form.Label htmlFor='ismanager' value="Manager" aria-label="Label for Checkbox">Is Manager </Form.Label>
        <InputGroup.Checkbox id="isadmin" onClick={()=>setIsAdmin(!isAdmin)} aria-label="Checkbox for following text input" />
        <Form.Label htmlFor='isadmin' value="Admin" aria-label="Label for Checkbox">Is Admin</Form.Label>
      </InputGroup>
 
  
                <button type="submit" onClick={handleSubmit}>Create User</button>
       
              </form>
    
        </div>
    )
}

