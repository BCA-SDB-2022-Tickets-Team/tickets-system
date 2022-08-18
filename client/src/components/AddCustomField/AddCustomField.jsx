import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Button, Container, Row, Table, Col } from "reactstrap";
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import "./AddCustomField.css"

const allowedRoles = [4]

const userTypes = ["Assessor", "Requestor"]
const fieldTypes = ["Text", "Drop-down", "Checkbox"]


function CreateCustomField(props) {

    const [name, setName] = useState("")
    const [fieldType, setFieldType] = useState("Field Type")
    const [isRequired, setIsRequired] = useState(false)
    const [defaultValue, setDefaultValue] = useState("")
    const [reqOrAsr, setReqOrAsr] = useState("Field Permissions")
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [dropdownOpen2, setDropdownOpen2] = useState(false)
    const [role, setRole] = useState(parseInt(props.sessionRole))
    const navigate = useNavigate()

    /*     useEffect(() => {
            if (!allowedRoles.includes(parseInt(props.sessionRole))) {
                navigate('/')
            } else {
                setRole(parseInt(props.sessionRole))
            }
        }, []) */

    const toggle = () => setDropdownOpen((prevState) => !prevState);
    const toggle2 = () => setDropdownOpen2((prevState) => !prevState);

    const onChangeHndler = (e, setter) => {
        setter(e.target.value)
    }

    const handleSubmit = e => {
        e.preventDefault()

        //TODO: convert field type into field type expected by the post route

        let newCustomField = {
            name: name,
            fieldType: fieldType,
            isRequired: isRequired,
            defaultValue: defaultValue,
            reqOrAsr: reqOrAsr
        }
        let url = 'http://localhost:4000/api/user/add-custom-field'
        fetch(url, {
            method: "POST",
            body: JSON.stringify(newCustomField),
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": props.sessionToken
            })
        })
            .then(res => res.json())
            .then(data => console.log(data))
    }

    return (
        <Container fluid className="add-custom-field-container">
            <Form className="form"
                inline
                onSubmit={handleSubmit}>
                <FormGroup className="mb-2 me-sm-2 mb-sm-0" >
                    <Label
                        className="me-sm-2"
                        for="nem"
                    >
                        Field Name
                    </Label>
                    <Input
                        id="Field Name"
                        name="field name"
                        type="name"
                        onChange={(e) => onChangeHndler(e, setName)}
                    />
                </FormGroup>
                <div className="d-flex p-5">
                    <Dropdown toggle={toggle} direction={"down"} isOpen={dropdownOpen}>
                        <DropdownToggle caret>
                            {fieldType}
                        </DropdownToggle>
                        <DropdownMenu container="body">
                            {fieldTypes.map(type => {
                                return (
                                    <DropdownItem onClick={() => setFieldType(fieldType)}>
                                        {type}
                                    </DropdownItem>
                                )
                            })}
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <FormGroup className="mb-2 me-sm-2 mb-sm-0" >
                    <Label
                        className="me-sm-2"
                        for="defaultValue"
                    >
                        Default Value(s)
                    </Label>
                    <Input
                        id="Default Value"
                        name="Default Value"
                        type="defaultValue"
                        onChange={(e) => onChangeHndler(e, setDefaultValue)}
                    />
                </FormGroup>
                <div className="d-flex p-5">
                    <Dropdown toggle={toggle2} direction={"down"} isOpen={dropdownOpen2}>
                        <DropdownToggle caret>
                            {reqOrAsr}
                        </DropdownToggle>
                        <DropdownMenu container="body">
                            {userTypes.map(userType => {
                                return (
                                    <DropdownItem onClick={() => setReqOrAsr(reqOrAsr)}>
                                        {userType}
                                    </DropdownItem>
                                )
                            })}
                        </DropdownMenu>
                    </Dropdown>
                </div>

                <br></br>
                <FormGroup className="checkbox"
                    check
                    inline
                >
                    <Input type="checkbox" onClick={() => setIsRequired(!isRequired)} />
                    <Label check>
                        Required field
                    </Label>

                </FormGroup>
                <Button type='submit'>
                    Create Field
                </Button>
            </Form>
        </Container>
    )
}

export default CreateCustomField