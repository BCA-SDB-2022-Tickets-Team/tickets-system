import React, { useState, useEffect, useContext } from 'react';
import { Form, FormGroup, Label, Input, Button, Table, Container, Row, Col } from "reactstrap";
import "./AddCustomField.css"
import { LoginContext } from '../../index';

//TODO: Add enum list-maker for drop-downs?

const fieldTypes = ["Text", "Drop-down", "Checkbox", "Date", "Number"]


function AddCustomField(props) {
    const { sessionRole, sessionToken } = useContext(LoginContext);
    const [role, setRole] = useState(parseInt(sessionRole));
    const [ticketFields, setTicketFields] = useState([])
    const [name, setName] = useState("")
    const [fieldType, setFieldType] = useState("")
    const [isRequired, setIsRequired] = useState(false)
    const [defaultValue, setDefaultValue] = useState("")
    const [reqOrAsr, setReqOrAsr] = useState(false)

    useEffect(() => {

        setRole(parseInt(sessionRole));

        async function getData() {
            let res = await fetch("http://localhost:4000/api/fields/view-all-fields", {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    Authorization: sessionToken,
                })
            });
            let data = await res.json();
            setTicketFields(data)
        }
        getData();
    }, []);

    const onChangeHandler = (e, setter) => {
        setter(e.target.value)
    }

    const handleSubmit = (e) => {
        console.log("submit")
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
                Authorization: sessionToken,
            })
        })
            .then(res => res.json())
            .then(data => console.log(data))
    }

    return (
        <Container>
            <Row id="edit-add-fields-row">
                <Col xs="4">
                    <h4>Existing Ticket Fields</h4>
                    <Table bordered striped responsive>
                        <tbody>
                            <tr>
                                <th>Field</th>
                                <th>Field Type</th>
                            </tr>
                            {ticketFields.map(field => {
                                if (field['Field Name'] !== "_id" && field['Field Name'] !== "__v") {
                                    return (
                                        <tr>
                                            <td>{field['Field Name']}</td>
                                            <td>{field['Field Type']}</td>
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                    </Table>
                </Col>
                <Col className="sidePanel" xs="5">
                    <Form className="add-field-form"
                        inline
                        onSubmit={handleSubmit}>
                        <h4>Add a Field</h4>
                        <FormGroup>
                            <Label for="name">
                                Field Name
                            </Label>
                            <Input
                                required
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Must be unique"
                                onChange={(e) => onChangeHandler(e, setName)}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="fieldType">
                                Field Type
                            </Label>
                            <Input
                                required
                                id="fieldType"
                                name="fieldType"
                                type="select"
                                onChange={(e) => onChangeHandler(e, setFieldType)}
                            >
                                <option disabled selected value>-- select --</option>
                                {fieldTypes.map(type => {
                                    return <option>{type}</option>
                                })}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="defaultValue">
                                Default Field Value
                            </Label>
                            <Input
                                id="defaultValue"
                                name="defaultValue"
                                type="text"
                                onChange={(e) => onChangeHandler(e, setDefaultValue)}
                            />
                        </FormGroup>
                        <br />
                        <FormGroup
                            className="checkbox"
                            check
                            inline
                        >
                            <Input
                                type="checkbox"
                                onClick={() => setReqOrAsr(!reqOrAsr)} />
                            <Label check>
                                Assessors Only
                            </Label>

                        </FormGroup>
                        <br />
                        <FormGroup
                            className="checkbox"
                            check
                            inline
                        >
                            <Input
                                type="checkbox"
                                onClick={() => setIsRequired(!isRequired)} />
                            <Label check>
                                Required Field
                            </Label>
                        </FormGroup>
                        <FormGroup id="add-custom-field-button">
                            <Button type='submit'>
                                Create Field
                            </Button>
                        </FormGroup>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default AddCustomField