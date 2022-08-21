import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import "./OneTicket.css";
import SaveModal from "./Modals/SaveModal";
import DeleteModal from "./Modals/DeleteModal";
import AssignModal from "./Modals/AssignModal";
import ClaimModal from "./Modals/ClaimModal";
import SubmitModal from "./Modals/SubmitModal";

function OneTicket(props) {
  const [oneTicketData, setOneTicketData] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [editDisplay, setEditDisplay] = useState("hide");
  const [readDisplay, setReadDisplay] = useState("show");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [onSwitch, setOnSwitch] = useState(false);
  const [modelData, setModelData] = useState({});
  const [objectToSend, setObjectToSend] = useState({});
  const notEditable = [
    "_id",
    "Requestor",
    "Assessor",
    "Created At",
    "Updated At",
    "Status",
  ];
  const nonEditableStatus = [
    "triage",
    "director-review",
    "requestor-review",
    "questionaire-sent",
    "completed",
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
      setOneTicketData(data);
    }
    getData();

    setUserRole(localStorage.getItem("role"));
    setUserId(localStorage.getItem("userId"));
    // grab those guys from local storage
  }, []);
  console.log(oneTicketData["Status"]);
  console.log(userId)
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
      <ClaimModal
        showClaimModal={showClaimModal}
        setShowClaimModal={setShowClaimModal}
        userId={userId}
        id={id}
      />
      <SaveModal
        showSaveModal={showSaveModal}
        setShowSaveModal={setShowSaveModal}
        id={id}
        objectToSend={objectToSend}
        onSwitch={onSwitch}
        setOnSwitch={setOnSwitch}
      />
      <SubmitModal
        showSubmitModal={showSubmitModal}
        setShowSubmitModal={setShowSubmitModal}
        id={id}
      />

      <div className="button-bar">
        {userRole === "3" && !oneTicketData.Assessor ? (
          <Button
            color="info"
            className={readDisplay}
            onClick={() => setShowClaimModal(true)}
            outline
          >
            Claim Ticket
          </Button>
        ) : null}
        {userRole === "3" &&
        oneTicketData["Status"] === "triage" &&
        userId === oneTicketData["Assessor"] ? (
          <Button
            color="info"
            className={readDisplay}
            onClick={() => {
              updateObject["Status"] = "in-progress";
              setObjectToSend(updateObject);
              setOnSwitch(true);
              setShowSaveModal(true);
            }}
            outline
          >
            Begin Assessment
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
                  : false
              }
              outline
            >
              Edit Ticket
            </Button>
            {oneTicketData['Status']==='in-progress' ? (
          <Button
            color="info"
            className={readDisplay}
            onClick={() => setShowSubmitModal(true)}
            outline
          >
            Submit For Review
          </Button>
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

            <Button
              color="info"
              className={readDisplay}
              onClick={() => setShowDeleteModal(true)}
              outline
            >
              Delete Ticket
            </Button>
          </>
        ) : null}
       
      </div>
      <Table striped className={readDisplay}>
        <tbody>
          {/* Map over the ticket and display its data in a table */}
          {Object.keys(oneTicketData).map((field) => {
            return (
              <tr key={field}>
                <td>{field}:</td>
                <td>
                  {modelData[field].type === "Boolean" ? (
                    oneTicketData[field] === true ? (
                      <input type="checkbox" defaultChecked={true} disabled />
                    ) : null
                  ) : (
                    oneTicketData[field]
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Table striped className={editDisplay}>
        <tbody>
          {/* Map over the ticket and display its data in a table */}
          {Object.keys(oneTicketData).map((field) => {
            let inputType;
            if (modelData[field].type === "Boolean") {
              inputType = "checkbox";
            }
            if (modelData[field].type === "String") {
              inputType = "text";
            }

            return (
              <>
                <tr key={field}>
                  <td>{field}:</td>

                  {!notEditable.includes(field) ? (
                    <td>
                      {modelData[field].enum === undefined ? (
                        <input
                          type={inputType}
                          onChange={(e) => {
                            if (modelData[field].type !== "Boolean") {
                              updateObject[field] = e.target.value;
                              console.log(updateObject);
                            }
                          }}
                          onClick={(e) => {
                            if (modelData[field].type === "Boolean") {
                              updateObject[field] =
                              updateObject[field]!==undefined
                              ? !updateObject[field]
                               : oneTicketData[field] === true ? false : true;
                            }
                          }}
                          defaultValue={oneTicketData[field]}
                          defaultChecked={oneTicketData[field]}
                        />
                      ) : (
                        // TODO: make dropdowns visible; possibly Popper js?

                        <UncontrolledDropdown>
                          <DropdownToggle caret>select</DropdownToggle>
                          <DropdownMenu
                            container="body"
                            className="dropdown"
                            positionFixed={true}
                          >
                            {modelData[field].enum.map((option) => {
                              <DropdownItem
                                onClick={(e) => {
                                  updateObject[field] = e.target.value;
                                }}
                              >
                                {option}
                              </DropdownItem>;
                            })}
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      )}
                    </td>
                  ) : (
                    oneTicketData[field]
                  )}
                </tr>
              </>
            );
          })}
        </tbody>
      </Table>
      <div className="button-bar">
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
      </div>
    </>
  );
}

export default OneTicket;
