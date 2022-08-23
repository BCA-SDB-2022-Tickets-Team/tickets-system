import React, { useEffect, useState } from "react";
import { Container, Form, Label, Input, FormGroup, InputGroup, InputGroupText, Button, Alert } from "reactstrap"
import "./NewTicket.css";

function NewTicket() {
  const [allData, setAllData] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false)
  const [alertMessage, setAlertMessage] = useState(undefined)
  const [alertType, setAlertType] = useState("warning")
  let newTicketBody = {};




  const onDismiss = () => {
    setAlertVisible(false)
    setAlertMessage(undefined)
    setAlertType("warning")
  }
  useEffect(() => {
    async function getData() {
      let res = await fetch("http://localhost:4000/api/ticket/req/model", {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }),
      });
      let data = await res.json();
      setAllData(data);
    }
    onDismiss()
    getData();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    console.log(`submitting: `, newTicketBody)
    fetch("http://localhost:4000/api/ticket/create", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      method: "POST",
      body: JSON.stringify({
        newTicketBody,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          let error = await res.json()
          setAlertVisible(true)
          if (error.missingFields) {
            let message = `${error.status} \n ${error.missingFields.join(' ')}`
            setAlertMessage(message)
          }
          console.log(error)
        } else {
          setAlertVisible(true)
          setAlertType("success")
          setAlertMessage("ticket successfully created")
          e.target.reset(); // TODO: change this so redirected instead of just form reset
          console.log("ticket created");
        }
      })

      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Container style={{
      maxWidth: '90vw',
      padding: '1vw 0'
    }}>
      <Alert color={alertType} isOpen={alertVisible} toggle={onDismiss}>
        {alertMessage}
      </Alert>

      <Form onSubmit={handleSubmit}>
        {
          allData.map((field) => {
            if (field.name === "Project Description") {
              return (
                <FormGroup key={field.name}>
                  <InputGroup>
                    <InputGroupText>
                      Description:
                    </InputGroupText>
                    <Input

                      id="project-description-textarea"
                      type="textarea"
                      name={field.name}
                      required
                      onChange={(e) => {
                        newTicketBody[field.name] = e.target.value
                      }}
                    />
                  </InputGroup>
                </FormGroup>
              )
            } else if (field.type === "Boolean") {
              newTicketBody[field.name] = false
              return (
                <FormGroup
                  key={field.name}
                  check
                  className="mb-3"
                  style={{
                    paddingLeft: "0"
                  }}
                >
                  <InputGroup>
                    <Input
                      readOnly
                      value={field.name}
                      style={{
                        pointerEvents: "none"
                      }}
                    />
                    <InputGroupText>
                      <Input
                        addon
                        type="checkbox"
                        name={field.name}
                        onClick={() => {
                          newTicketBody[field.name] = !newTicketBody[field.name]
                        }}
                      />
                    </InputGroupText>
                  </InputGroup>
                </FormGroup>
              )
            } else if (!field.enum) {
              if (field.type === "String") {
                return (
                  <FormGroup key={field.name}>
                    <InputGroup>
                      <InputGroupText>
                        {field.name}
                      </InputGroupText>
                      <Input
                        name={field.name}
                        onChange={(e) => {
                          newTicketBody[field.name] = e.target.value
                        }}
                      />
                    </InputGroup>
                  </FormGroup>
                )
              } else if (field.type === "Number") {
                return (
                  <FormGroup key={field.name}>
                    <InputGroup>
                      <InputGroupText>
                        {field.name}
                      </InputGroupText>
                      <Input
                        name={field.name}
                        placeholder="0"
                        type="number"
                        onChange={(e) => {
                          newTicketBody[field.name] = e.target.value
                        }}
                      />
                    </InputGroup>
                  </FormGroup>
                )
              } else if (field.type === "Date") {
                return (
                  <FormGroup key={field.name}>
                    <InputGroup>
                      <InputGroupText>
                        {field.name}
                      </InputGroupText>
                      <Input
                        name={field.name}
                        placeholder={new Intl.DateTimeFormat('en-US').format(Date.now())}
                        type="datetime"
                        onChange={(e) => {
                          newTicketBody[field.name] = new Date(e.target.value)
                        }}
                      />
                    </InputGroup>
                  </FormGroup>
                )
              }
            } else {
              return (
                <FormGroup>
                  <InputGroup>
                    <InputGroupText>
                      {field.name}
                    </InputGroupText>
                    <Input
                      addon
                      type="select"
                      required
                      onChange={(e) => {
                        newTicketBody[field.name] = e.target.value
                      }}
                      style={{
                        flexGrow: 1,
                      }}
                    >
                      {
                        field.enum.map((item) => {
                          return (
                            <option
                              key={item}
                              value={item}
                            >
                              {item}
                            </option>
                          )
                        })
                      }
                    </Input>
                  </InputGroup>
                </FormGroup>
              )
            }
          })
        }
        <Button type="submit" color="primary">
          Submit Ticket
        </Button>
      </Form>
    </Container>
  );
}

export default NewTicket;
