import React, { useState, useEffect, useContext, useNavigate } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Container,
  Row,
  Table,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { LoginContext } from '../../index';
import "./createuser.css";
import Switch from "./Switch";
import EditUserModal from "./Edituser";

const departments = [
  "HR",
  "IT",
  "Legal",
  "Manufacturing",
  "Marketing",
  "Ops",
  "Procurement",
];

function CreateUser() {
  const { sessionRole, sessionToken } = useContext(LoginContext);
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setdepartment] = useState("department");
  const [isManager, setIsManager] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [role, setRole] = useState(parseInt(sessionRole));
  const [allUsers, setAllUsers] = useState(undefined);
  const [asrMakingReq, setAsrMakingReq] = useState(false);
  const [showModal, setShowModal] = useState(false)
  const [userToEdit, setUserToEdit] = useState(undefined)

  const roleNames = {
    reqUser: "Requestor",
    asrUser: "Assessor"
  }

  const fetchAllUsers = async function () {
    let allUsersResponse = await fetch(
      `http://localhost:4000/api/user/allusers`,
      {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: sessionToken,
        }),
      }
    );
    if (allUsersResponse.ok) {
      console.log(`allusers response:`, allUsersResponse);
      await allUsersResponse
        .json()
        .then((data) => {
          console.log(data);
          setAllUsers(data.allUsers);
        })
        .catch((err) => console.log(err));
    } else {
      let errorMsg = await allUsersResponse.json();
      console.log(`error getting /allusers: `, allUsersResponse);
      throw new Error(errorMsg.status);
    }
  }
  useEffect(() => {
    setRole(parseInt(sessionRole));
    async function getAllUsers() {
      try {
        await fetchAllUsers()
      } catch (error) {
        console.log(`awww shucks: `, error);
      }
    }
    getAllUsers();
    // }
  }, []);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const onChangeHndler = (e, setter) => {
    setter(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let url
    let newUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      Department: department,
      password: password,
    };
    if (role === 2 || (role === 4 && asrMakingReq)) {
      newUser["Department"] = department;
      newUser["isManager"] = isManager;
      url = "http://localhost:4000/api/user/req"
    } else if (role === 4 && !asrMakingReq) {
      newUser["isAdmin"] = isAdmin;
      url = "http://localhost:4000/api/user/asr"
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: sessionToken,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  const handleEditUser = function (user) {
    setUserToEdit(user)
    setShowModal(val => !val)
  }

  const handleCloseEditUser = async function () {
    setUserToEdit(undefined)
    setShowModal()
    await fetchAllUsers()
  }
  return (
    <>
      {
        userToEdit ?
          <EditUserModal
            showModal={showModal}
            setShowModal={setShowModal}
            user={userToEdit}
            closeModal={handleCloseEditUser}
            departments={departments}
            token={sessionToken}
            className="modify-user-modal"
          />
          :
          null
      }
      <Container fluid className="create-user-container">
        <Row className="create-user-row">
          <Col xs="8">
            <Table
              responsive
              hover
              striped
            >
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>E-mail</th>
                  <th>Department</th>
                  {role === 4 ? <th>User Type</th> : null}
                  <th>Admin?</th>
                </tr>
              </thead>
              <tbody>
                {allUsers !== undefined
                  ? allUsers.map((user) => {
                    return (
                      <tr key={user._id} onClick={() => handleEditUser(user)}>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.email}</td>
                        <td>
                          {user.Department !== undefined
                            ? user.Department
                            : `-`}
                        </td>
                        {role === 4 ? <td>{roleNames[user.__type]}</td> : null}
                        <td>
                          {user.isManager !== undefined
                            ? <Input type="checkbox" disabled id="display-only-checkbox" checked={user.isManager} />//`${user.isManager}`
                            : <Input type="checkbox" disabled id="display-only-checkbox-2" checked={user.isAdmin} />}
                        </td>
                      </tr>
                    );
                  })
                  : null}
              </tbody>
            </Table>
          </Col>
          <Col className="sidePanel" xs="2">
            <div className="FormContainer">
              <Switch
                isOn={asrMakingReq}
                onColor="#EF476F"
                handleToggle={setAsrMakingReq}
              />
              <Form className="form" inline onSubmit={handleSubmit}>
                <FormGroup className="mb-2 me-sm-2 mb-sm-0">
                  <Label className="me-sm-2" for="exampleEmail">
                    First Name
                  </Label>
                  <Input
                    id="First Name"
                    name="first name"
                    type="name"
                    onChange={(e) => onChangeHndler(e, setFirst)}
                  />
                </FormGroup>
                <FormGroup className="mb-2 me-sm-2 mb-sm-0">
                  <Label className="me-sm-2" for="examplePassword">
                    Last Name
                  </Label>
                  <Input
                    id="Last Name"
                    name="last name"
                    type="last name"
                    onChange={(e) => onChangeHndler(e, setLast)}
                  />
                </FormGroup>
                <FormGroup className="mb-2 me-sm-2 mb-sm-0">
                  <Label className="me-sm-2" for="examplePassword">
                    Email
                  </Label>
                  <Input
                    id="Email"
                    name="email"
                    type="email"
                    onChange={(e) => onChangeHndler(e, setEmail)}
                  />
                </FormGroup>

                <FormGroup className="mb-2 me-sm-2 mb-sm-0">
                  <Label className="me-sm-2" for="examplePassword">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    onChange={(e) => onChangeHndler(e, setPassword)}
                  />
                </FormGroup>
                {(role === 2 || asrMakingReq)
                  ? (
                    <div className="d-flex p-5">
                      <Dropdown
                        toggle={toggle}
                        direction={"down"}
                        isOpen={dropdownOpen}
                      >
                        <DropdownToggle caret>{department}</DropdownToggle>
                        <DropdownMenu container="body">
                          {departments.map((department) => {
                            return (
                              <DropdownItem
                                onClick={() => setdepartment(department)}
                              >
                                {department}
                              </DropdownItem>
                            );
                          })}
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  )
                  : (<br />)}
                <FormGroup className="checkbox" check inline>
                  {(role === 2 || asrMakingReq) ? (
                    <>
                      <Input
                        type="checkbox"
                        onClick={() => setIsManager(!isManager)}
                      />
                      <Label check>Is Manager</Label>
                    </>
                  ) : (
                    <>
                      {" "}
                      <Input
                        type="checkbox"
                        onClick={() => setIsAdmin(!isAdmin)}
                      />
                      <Label check>Is Admin</Label>
                    </>
                  )}
                </FormGroup>
                <Button id="button" type="submit">Submit</Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default CreateUser;
