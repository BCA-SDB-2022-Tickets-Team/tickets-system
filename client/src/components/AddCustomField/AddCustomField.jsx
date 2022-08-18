import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormGroup, Label, Input, Button, Container, Row, Col } from "reactstrap";
import "./AddCustomField.css"

//TODO: Add enum list-maker for drop-downs. Try again on conditional fields (field showing up based on entry in previous field)

const allowedRoles = [4]

const fieldTypes = ["Text", "Drop-down", "Checkbox", "Date", "Number"]


function AddCustomField(props) {

    const [name, setName] = useState("")
    const [fieldType, setFieldType] = useState("")
    const [isRequired, setIsRequired] = useState(false)
    const [defaultValue, setDefaultValue] = useState("")
    const [reqOrAsr, setReqOrAsr] = useState(false)
    const [role, setRole] = useState(parseInt(props.sessionRole))
    const navigate = useNavigate()

    /*     useEffect(() => {
            if (!allowedRoles.includes(parseInt(props.sessionRole))) {
                navigate('/')
            } else {
                setRole(parseInt(props.sessionRole))
            }
        }, []) */

    const onChangeHandler = (e, setter) => {
        setter(e.target.value)
    }

    const handleSubmit = e => {

        e.preventDefault()

        let newCustomField = {
            name: name,
            fieldType: fieldType,
            isRequired: isRequired,
            defaultValue: defaultValue,
            reqOrAsr: reqOrAsr
        }
        console.log(newCustomField)
        let url = 'http://localhost:4000/api/fields/add-custom-field'
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
        <Form className="form"
            inline
            onSubmit={handleSubmit}>
            <FormGroup className="mb-2 me-sm-2 mb-sm-0" >
                <Label
                    className="me-sm-2"
                    for="name"
                >
                    Field Name
                </Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    onChange={(e) => onChangeHandler(e, setName)}
                />
            </FormGroup>
            <FormGroup className="mb-2 me-sm-2 mb-sm-0" >
                <Label
                    className="me-sm-2"
                    for="fieldType"
                >
                    Field Type
                </Label>
                <Input
                    id="fieldType"
                    name="fieldType"
                    type="select"
                    onChange={(e) => onChangeHandler(e, setFieldType)}
                >
                    {fieldTypes.map(type => {
                        return <option>{type}</option>
                    })}
                </Input>
            </FormGroup>
            <FormGroup className="mb-2 me-sm-2 mb-sm-0" >
                <Label
                    className="me-sm-2"
                    for="defaultValue"
                >
                    Default Field Value(s)
                </Label>
                <Input
                    id="defaultValue"
                    name="defaultValue"
                    type="text"
                    onChange={(e) => onChangeHandler(e, setDefaultValue)}
                />
            </FormGroup>
            <br />
            <FormGroup className="checkbox"
                check
                inline
            >
                <Input type="checkbox" onClick={() => setReqOrAsr(!reqOrAsr)} />
                <Label check>
                    Assessors Only
                </Label>

            </FormGroup>
            <br />
            <FormGroup className="checkbox"
                check
                inline
            >
                <Input type="checkbox" onClick={() => setIsRequired(!isRequired)} />
                <Label check>
                    Required Field
                </Label>

            </FormGroup>
            <Button type='submit'>
                Create Field
            </Button>
        </Form>
    )
}

export default AddCustomField