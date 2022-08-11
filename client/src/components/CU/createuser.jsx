import React, { useState } from 'react'
import './createuser.css'


function createUser(props) {

    // useState variables 
    const [firstName, setFirst] = useState("")
    const [lastName, setLast] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("")
    const [isManager, setIsManager] = useState("")
    const [isAdmin, setIsAdmin] = useState("")


  const createUser = e => {
      e.preventDefault()
  }
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


    return (
        <div>
            <form className="createUserWrapper" action="" onSubmit={handleSubmit}>
            <div className="firstName">
                    <label htmlFor="firstname">Username:</label>
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
              
                
            </form>
            <div style={divStyle}>
                <DropDownListComponent 
                className="roleDropDown"
                dataSource={employees} 
                placeolder fields={{text:"Role", value:roles}}
                onChange={e => setRole(e.target.value)}></DropDownListComponent>
            </div>
           




            <button type="submit">Create User</button>

        </div>
    )
}

export default createUser