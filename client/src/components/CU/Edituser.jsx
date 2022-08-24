import React, { useState, useRef } from "react";
import {
  Modal,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Alert
} from "reactstrap";

function EditUserModal(props) {
  const [firstName, setFirst] = useState(props.user.firstName);
  const [lastName, setLast] = useState(props.user.lastName);
  const [email, setEmail] = useState(props.user.email);
  const [password, setPassword] = useState(undefined);
  const [department, setDepartment] = useState(props.user.Department);
  const [isManager, setIsManager] = useState(props.user.isManager ? props.user.isManager : false);
  const [isAdmin, setIsAdmin] = useState(props.user.isAdmin ? props.user.isAdmin : false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(true)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const toggleModal = () => {
    props.setShowModal(val => !val)
    props.closeModal()
    setModalIsOpen(props.showModal)
  }
  const toggleDropdown = () => setDropdownOpen(val => !val)
  const onChangeHndler = (e, setter) => {
    setter(e.target.value);
  }
  const handleSubmit = function (e) {
    e.preventDefault()
    let url
    let modifiedUser = {
      _id: props.user._id,
      firstName: firstName,
      lastName: lastName,
      email: email,
    };
    if (password !== undefined) {
      modifiedUser['password'] = password
    }
    if (props.user.__type === "reqUser") {
      modifiedUser["Department"] = department;
      modifiedUser["isManager"] = isManager;
      url = "http://localhost:4000/api/user/req"
    } else if (props.user.__type === "asrUser") {
      modifiedUser["isAdmin"] = isAdmin;
      url = "http://localhost:4000/api/user/asr"
    }
    fetch(url, {
      method: "PUT",
      body: JSON.stringify(modifiedUser),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: props.token,
      }),
    })
      .then((res) => {
        if (res.ok) {
          toggleModal()
        } else {
          res.json()
            .then((data) => {
              setShowAlert(true)
              setAlertMessage(data.status)
            });
        }
      });
  }

  const handleDelete = function (e) {
    e.preventDefault()
    let url = `http://localhost:4000/api/user/${props.user.__type === 'reqUser' ? 'req' : 'asr'}`
    fetch(url, {
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: props.token,
      }),
      body: JSON.stringify({
        _id: props.user._id
      })
    })
      .then(res => {
        if (res.ok) {
          toggleModal()
        } else {
          res.json()
            .then(data => {
              setShowAlert(true)
              setAlertMessage(data.status)
            })
        }
      })
  }
  return (
    <Modal
      isOpen={modalIsOpen}
      toggle={toggleModal}
    >
      <ModalBody className="modUser">
        <Alert
          color="warning"
          isOpen={showAlert}
          toggle={() => {
            setShowAlert(alert => !alert)
          }}
        >
          {alertMessage}
        </Alert>
        <Form className="form" inline onSubmit={handleSubmit}>
          <FormGroup className="mb-2 me-sm-2 mb-sm-0">
            <Label className="me-sm-2" for="exampleEmail">
              First Name
            </Label>
            <Input
              id="First Name"
              name="first name"
              value={firstName}
              autoComplete="off"
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
              value={lastName}
              autoComplete="off"
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
              value={email}
              autoComplete="off"
              onChange={(e) => onChangeHndler(e, setEmail)}
            />
          </FormGroup>

          <FormGroup className="mb-2 me-sm-2 mb-sm-0">
            <Label className="me-sm-2" for="examplePassword">
              Change Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              autoComplete="off"
              onChange={(e) => onChangeHndler(e, setPassword)}
            />
          </FormGroup>
          <FormGroup>
            {props.user.__type === "reqUser" ? (
              <FormGroup>
                <Label>Department</Label>
                <Dropdown
                  toggle={toggleDropdown}
                  direction={"down"}
                  isOpen={dropdownOpen}
                  style={{
                    minWidth: '100%',
                  }} 
                >
                  <DropdownToggle 
                    caret 
                    block
                    style={{
                      minWidth: '100%',
                    }} 
                  >
                    {department}
                  </DropdownToggle>
                  <DropdownMenu>
                    {props.departments.map((dept) => {
                      return (
                        <DropdownItem
                          key={dept}
                          onClick={() => setDepartment(dept)}
                          active={dept === department}
                        >
                          {dept}
                        </DropdownItem>
                      );
                    })}
                  </DropdownMenu>
                </Dropdown>
              </FormGroup>
            ) : null}
          </FormGroup>
          <FormGroup className="checkbox" check inline switch>
            {props.user.__type === "reqUser" ? (
              <>
                <Input
                  type="checkbox"
                  defaultChecked={isManager}
                  onClick={() => setIsManager(!isManager)}
                />
                <Label check>Is Manager</Label>
              </>
            ) : (
              <>
                {" "}
                <Input
                  type="checkbox"
                  defaultChecked={isAdmin}
                  onClick={() => setIsAdmin(!isAdmin)}
                />
                <Label check>Is Admin</Label>
              </>
            )}
          </FormGroup>
          <FormGroup style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: '2vh'
          }}>
            <Button id="button" type="submit">Submit</Button>
            <Button color="danger" onClick={handleDelete}>
              Delete User
            </Button>
          </FormGroup>
        </Form>
      </ModalBody>
    </Modal>
  );
}

export default EditUserModal;
