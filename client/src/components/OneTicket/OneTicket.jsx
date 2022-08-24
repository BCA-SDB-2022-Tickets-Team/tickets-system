import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table,
  Button,
  Container,
  Row,
  Col,
  Form,
  Input,
  FormGroup,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import "./OneTicket.css";
import SaveModal from "./Modals/SaveModal";
import DeleteModal from "./Modals/DeleteModal";
import AssignModal from "./Modals/AssignModal";
import SubmitModal from "./Modals/SubmitModal";
import UpdateStatusModal from "./Modals/UpdateStatusModal";

function OneTicket(props) {
  const [oneTicketData, setOneTicketData] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [editDisplay, setEditDisplay] = useState("hide");
  const [readDisplay, setReadDisplay] = useState("show");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [modelData, setModelData] = useState({});
  const [objectToSend, setObjectToSend] = useState({});
  const [ticketAssessor, setTicketAssessor] = useState('')
  const [ticketRequestor, setTicketRequestor] = useState('')
  const [ticketManager, setTicketManager] = useState('')
  const colorCodes = {
    'New Request': "#f7b731",
    'Triage': "#227093",
    'Questionaire Sent': "#8CB5CE",
    'Review (Requestor)': "#05c46b",
    'Review (Director)': "#218c74",
    'On-Hold (Vendor)': "#ff6b81",
    'In Progress': "#0fb9b1",
    'Completed': "#6ab04c"
  }
  const notEditable = [
    "_id",
    "Requestor",
    "Assessor",
    "Created At",
    "Updated At",
    "Status",
    "ID",
    "__v",
    "Project Manager"
  ];
  const nonEditableStatus = [
    "Triage",
    "Review (Director)",
    "Review (Requestor)",
    "Questionaire Sent",
    "Completed",

  ];

  const params = new URLSearchParams(window.location.search);
  // ticket id passed as params from allTickets
  const id = params.get("id");
  let updateObject = {};
  // will be body of put request

  useEffect(() => {
    async function getData() {
      let res = await fetch("http://localhost:4000/api/ticket/asr/model", {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }),
      });
      let data = await res.json();
      setModelData(data);
    }
    getData();
  }, []);

  useEffect(() => {
    async function getData() {
      let res = await fetch(`http://localhost:4000/api/ticket/${id}`, {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }),
      });
      let data = await res.json();
      setOneTicketData(data.ticket);
      for (let user of data.allUsers) {
        if (user._id === data.ticket.Assessor) {
          setTicketAssessor(`${user.firstName} ${user.lastName}`)
        } else if (user._id === data.ticket.Requestor) {
          setTicketRequestor(`${user.firstName} ${user.lastName}`)
        } else if (user._id === data.ticket['Project Manager']) {
          if (data.ticket['Project Manager'] === 'n/a') {
            setTicketManager('N/A')
          } else {
            setTicketManager(`${user.firstName} ${user.lastName}`)
          }
        }
      }
    }
    getData();

    setUserRole(localStorage.getItem("role"));
    setUserId(localStorage.getItem("userId"));
    // grab those guys from local storage
  }, []);
  function updateStatus(status, type) {
    if (type === "claim") {
      updateObject["Assessor"] = userId;
    }
    updateObject["Status"] = status;
    setObjectToSend(updateObject);
    setShowUpdateStatusModal(true);
  }

  return (
    <>
      <DeleteModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        id={id}
      />
      {userRole === "4" ? (
        <AssignModal
          showAssignModal={showAssignModal}
          setShowAssignModal={setShowAssignModal}
          id={id}
        />
      ) : null}
      <UpdateStatusModal
        showUpdateStatusModal={showUpdateStatusModal}
        setShowUpdateStatusModal={setShowUpdateStatusModal}
        objectToSend={objectToSend}
        id={id}
      />
      <UpdateStatusModal
        showUpdateStatusModal={showUpdateStatusModal}
        setShowUpdateStatusModal={setShowUpdateStatusModal}
        objectToSend={objectToSend}
        id={id}
      />
      <SaveModal
        showSaveModal={showSaveModal}
        setShowSaveModal={setShowSaveModal}
        id={id}
        objectToSend={objectToSend}
      />
      <SubmitModal
        showSubmitModal={showSubmitModal}
        setShowSubmitModal={setShowSubmitModal}
        id={id}
      />
      <Container id="one-ticket-container">
        <h4>Ticket ID: {oneTicketData.ID}</h4>
        <Row>
          <Col xs="8">
            <Table id="one-ticket-data-table" striped bordered responsive className={readDisplay}>
              <tbody>
                {/* Map over the ticket and display its data in a table */}
                {Object.keys(modelData).map((field) => {
                  if (field !== "_id" && field !== "__v" && field !== "ID") {
                    return (
                      <tr key={field}>
                        <td className="one-ticket-table-fieldname">{field}:</td>
                        <td
                          style={field === 'Status' ? {
                            fontWeight: "bold",
                            color: `${colorCodes[oneTicketData['Status']]}`
                          } : null}
                        >
                          {modelData[field].type === "Boolean" ? (
                            oneTicketData[field] === true ? (
                              <Input
                                type="checkbox"
                                defaultChecked={true}
                                disabled
                                addon
                              />
                            ) : null
                          ) : (
                            field === 'Assessor'
                              ? ticketAssessor
                              : (field === 'Requestor'
                                ? ticketRequestor
                                : (field === 'Project Manager'
                                  ? (oneTicketData[field] === 'n/a' ? 'N/A' : ticketManager)
                                  : (field === 'Created At' || field === 'Updated At'
                                    ? `${new Date(oneTicketData[field]).toLocaleDateString()}  -  ${new Date(oneTicketData[field]).toLocaleTimeString(navigator.language, {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}`
                                    : oneTicketData[field]
                                  )
                                )
                              )
                          )}
                        </td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </Table>
          </Col>
          {/*-----------------------------------------------------------------------------------*/}
          <Col className={editDisplay} xs="8">
            <Form id="edit-ticket-form">
              {Object.keys(modelData).map((field) => {
                if (!notEditable.includes(field)) {
                  if (modelData[field].type === "Boolean") {
                    return (
                      <FormGroup
                        key={field.name}
                        check
                        className="mb-3"
                        style={{
                          paddingLeft: "0",
                        }}
                      >
                        <InputGroup>
                          <Input
                            readOnly
                            value={field}
                            style={{
                              pointerEvents: "none",
                            }}
                          />
                          <InputGroupText>
                            <Input
                              addon
                              type="checkbox"
                              name={field}
                              defaultChecked={oneTicketData[field]}
                              onClick={() => {
                                updateObject[field] =
                                  updateObject[field] !== undefined
                                    ? !updateObject[field]
                                    : oneTicketData[field] === true
                                      ? false
                                      : true;
                              }}
                            />
                          </InputGroupText>
                        </InputGroup>
                      </FormGroup>
                    );
                  } else if (!modelData[field].enum) {
                    return (
                      <FormGroup key={field}>
                        <InputGroup>
                          <InputGroupText>{field}</InputGroupText>
                          <Input
                            name={field}
                            defaultValue={oneTicketData[field]}
                            onChange={(e) => {
                              updateObject[field] = e.target.value;
                            }}
                          />
                        </InputGroup>
                      </FormGroup>
                    );
                  } else {
                    let currentValue=oneTicketData[field]
                    return (
                      <FormGroup>
                        <InputGroup>
                          <InputGroupText>{field}</InputGroupText>
                          <Input
                            addon
                            type="select"
                            value={currentValue}
                            onChange={(e) => {
                              currentValue=e.target.value
                              updateObject[field] = e.target.value;
                            }}
                            style={{
                              flexGrow: 1,
                            }}
                          >
                            {modelData[field].enum.map((item) => {
                              return (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              );
                            })}
                          </Input>
                        </InputGroup>
                      </FormGroup>
                    );
                  }
                } else {
                  if (field !== "_id" && field !== "__v" && field !== "ID") {
                    return (
                      <FormGroup key={field}>
                        <InputGroup>
                          <InputGroupText
                            readOnly
                            value={field}
                            style={{
                              pointerEvents: "none",
                              backgroundColor: "#F8F8F8"
                            }}
                          >
                            {field}
                          </InputGroupText>
                          <Input
                            readOnly
                            value={(
                              field === 'Assessor'
                                ? ticketAssessor
                                : (field === 'Requestor'
                                  ? ticketRequestor
                                  : (field === 'Project Manager'
                                    ? (oneTicketData[field] === 'n/a' ? 'N/A' : ticketManager)
                                    : (field === 'Created At' || field === 'Updated At'
                                      ? `${new Date(oneTicketData[field]).toLocaleDateString()}  -  ${new Date(oneTicketData[field]).toLocaleTimeString(navigator.language, {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}`
                                      : oneTicketData[field]
                                    )
                                  )
                                )
                            )}
                            style={field === 'Status' ? {
                              pointerEvents: "none",
                              backgroundColor: "#F8F8F8",
                              color: `${colorCodes[oneTicketData['Status']]}`,
                              fontWeight: "bold"
                            }
                              : {
                                pointerEvents: "none",
                                backgroundColor: "#F8F8F8",
                              }}
                          />
                        </InputGroup>
                      </FormGroup>
                    );
                  }
                }
              })}
            </Form>
          </Col>
          {/*-----------------------------------------------------------------------------------*/}
          <Col xs="3" className="button-bar">
            <Button
              color="info"
              className={editDisplay}
              onClick={() => {
                console.log(updateObject);
                setObjectToSend(updateObject);
                setShowSaveModal(true);
              }}
            >
              Save
            </Button>
            <Button
              color="info"
              className={editDisplay}
              onClick={() => {
                window.location.reload(false);
              }}
            >
              Cancel
            </Button>
            {(userRole === "4" || oneTicketData['Assessor'] === userId) && ["In Progress", "On-Hold (Vendor)"].includes(oneTicketData['Status'])
              ? <Form id="vendor-hold-form">
                <FormGroup
                  key="vendor-hold"
                  check
                  className="mb-3"
                  style={{
                    paddingLeft: "0",
                  }}
                >
                  <InputGroup>
                    <Input
                      readOnly
                      value={"On hold - awaiting vendor response"}
                      style={oneTicketData['Status'] === 'On-Hold (Vendor)' ? {
                        pointerEvents: "none",
                        backgroundColor: "#fa8072"
                      } : { pointerEvents: "none" }}
                    />
                    <InputGroupText>
                      <Input
                        addon
                        type="checkbox"
                        defaultChecked={
                          oneTicketData["Status"] === "On-Hold (Vendor)" ? true : null
                        }
                        onClick={() => {
                          updateObject["Status"] =
                            oneTicketData["Status"] === "On-Hold (Vendor)"
                              ? "In Progress"
                              : "On-Hold (Vendor)";
                          setObjectToSend(updateObject);
                          setShowUpdateStatusModal(true);
                        }}
                      />
                    </InputGroupText>
                  </InputGroup>
                </FormGroup>
              </Form>
              : null
            }
            {userRole === "3" && !oneTicketData.Assessor ? (
              <Button
                color="info"
                className={readDisplay}
                onClick={() => {
                  updateStatus("Triage", "claim");
                }}
                outline
              >
                Claim Ticket
              </Button>
            ) : null}

            {(userRole === "3" && userId === oneTicketData["Assessor"]) ||
              userRole === "4" ? (
              <>
                <Button
                  color="info"
                  className={readDisplay}
                  onClick={() => {
                    setReadDisplay("hide");
                    setEditDisplay("show");
                  }}
                  disabled={
                    nonEditableStatus.includes(oneTicketData["Status"]) &&
                      userRole === "3"
                      ? true
                      : (oneTicketData['Status'] === 'Completed' ? true : false)
                  }
                  outline
                >
                  Edit Ticket
                </Button>
                {userId === oneTicketData["Assessor"] ? (
                  <>
                    {oneTicketData["Status"] === "Triage" ? (
                      <Button
                        color="warning"
                        className={readDisplay}
                        onClick={() => {
                          updateStatus("In Progress");
                        }}
                        outline
                      >
                        Begin Assessment
                      </Button>
                    ) : null}
                    {oneTicketData["Status"] === "In Progress" ? (
                      <Button
                        color="success"
                        className={readDisplay}
                        onClick={() => updateStatus("Review (Director)")}
                        outline
                      >
                        Submit For Review
                      </Button>
                    ) : null}
                  </>
                ) : null}
              </>
            ) : null}

            {userRole === "4" ? (
              <>
                {!oneTicketData.Assessor ? (
                  <Button
                    color="info"
                    className={readDisplay}
                    onClick={() => {
                      setShowAssignModal(true);
                    }}
                    outline
                  >
                    Assign Ticket
                  </Button>
                ) : null}
                {(oneTicketData["Status"] === "Review (Director)") || (oneTicketData["Status"] === "Review (Requestor)") ? (
                  <>
                    <Button
                      color="warning"
                      className={readDisplay}
                      onClick={() => {
                        updateStatus("In Progress");
                      }}
                    >
                      Reopen Assessment
                    </Button>

                    <Button
                      color="success"
                      className={readDisplay}
                      onClick={() => {
                        updateStatus('Review (Requestor)');
                      }}
                    >
                      Submit to Client
                    </Button>
                  </>
                ) : null}
                {<Button
                  color="danger"
                  className={readDisplay}
                  onClick={() => setShowDeleteModal(true)}
                  outline
                >
                  Delete Ticket
                </Button>}
                {oneTicketData['Status'] === 'Review (Requestor)'
                  ? <Button
                    style={{ backgroundColor: '#6ab04c', color: "white", border: "none", height: "40px" }}
                    className={readDisplay}
                    onClick={() => updateStatus('Completed')}
                  >Ticket Complete</Button>
                  : null
                }
              </>
            ) : null}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default OneTicket;
