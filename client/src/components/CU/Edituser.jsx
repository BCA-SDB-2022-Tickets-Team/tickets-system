import React, {useState} from "react";
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
  Button
} from "reactstrap";

function EditUserModal(props) {
  const [firstName, setFirst] = useState(props.user.firstName);
  const [lastName, setLast] = useState(props.user.lastName);
  const [email, setEmail] = useState(props.user.email);
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("department");
  const [isManager, setIsManager] = useState(props.user.isManager ? props.user.isManager : false);
  const [isAdmin, setIsAdmin] = useState(props.user.isAdmin ? props.user.isAdmin : false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(true)
  const toggleModal = () => {
    props.setShowModal(val => !val)
    setModalIsOpen(props.showModal)
  }
  const toggleDropdown = () => setDropdownOpen(val => !val)
  const onChangeHndler = (e, setter) => {
    setter(e.target.value);
  }
  const handleSubmit = function(e){
    e.preventDefault()
  }
  return (
    <Modal 
      isOpen={modalIsOpen}
      toggle={toggleModal}
    >
      <ModalBody>
        <Form>
          <Form className="form" inline onSubmit={handleSubmit}>
              <FormGroup className="mb-2 me-sm-2 mb-sm-0">
                <Label className="me-sm-2" for="exampleEmail">
                  First Name
                </Label>
                <Input
                  id="First Name"
                  name="first name"
                  default={firstName}
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
                  default={lastName}
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
                  default={email}
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
                  default={password}
                  onChange={(e) => onChangeHndler(e, setPassword)}
                />
              </FormGroup>
              <div className="d-flex p-5">
                {props.user.__type === "reqUser" ? (
                  <Dropdown
                    toggle={toggleDropdown}
                    direction={"down"}
                    isOpen={dropdownOpen}
                  >
                    <DropdownToggle caret>{department}</DropdownToggle>
                    <DropdownMenu container="body">
                      {props.departments.map((department) => {
                        return (
                          <DropdownItem
                            key={department}
                            onClick={() => setDepartment(department)}
                          >
                            {department}
                          </DropdownItem>
                        );
                      })}
                    </DropdownMenu>
                  </Dropdown>
                ) : null}
              </div>
              <FormGroup className="checkbox" check inline>
                {props.user.__type === "reqUser" ? (
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
        </Form>
      </ModalBody>
    </Modal>
  );
}

export default EditUserModal;
