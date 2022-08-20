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
import Assign from "./Modals/Assign";

function OneTicket(props) {
  const [oneTicketData, setOneTicketData] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [editDisplay, setEditDisplay] = useState("hide");
  const [readDisplay, setReadDisplay] = useState("show");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [modelData, setModelData] = useState({});
  const [objectToSend, setObjectToSend] = useState({});
  const notEditable = [
    "_id",
    "Requestor",
    "Assessor",
    "Created At",
    "Updated At",
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
  console.log(modelData);

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

  function claimTicket() {
    fetch(`http://localhost:4000/api/ticket/modify/${id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }),
      // body: JSON.stringify({ Assessor: userId }),
      body: JSON.stringify({
        Assessor: userId,
      }),
    })
      .then((data) => {
        return data.json();
      })
      .then((realData) => {
        console.log(realData);
      })
      .catch(Error)
      .then();
  }

  return (
    <>
      <DeleteModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        id={id}
      />
      <Assign
        showAssignModal={showAssignModal}
        setShowAssignModal={setShowAssignModal}
        id={id}
      />

      <div className="button-bar">
        {userRole === "3" && !oneTicketData.Assessor ? (
          <Button
            color="info"
            className={readDisplay}
            onClick={claimTicket}
            outline
          >
            Claim Ticket
          </Button>
        ) : null}

        {(userRole === "3" && userId === oneTicketData.Assessor) ||
        userRole === "4" ? (
          <Button
            color="info"
            className={readDisplay}
            onClick={() => {
              setReadDisplay("hide");
              setEditDisplay("show");
            }}
            outline
          >
            Edit Ticket
          </Button>
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
                <td>{oneTicketData[field]}</td>
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
                            updateObject[field] =
                              !modelData[field].type === "Boolean"
                                ? e.target.value
                                : e.target.value
                                ? true
                                : false;
                          }}
                          defaultValue={oneTicketData[field]}
                        />
                      ) : (
                        // TODO: make dropdowns visible; possibly Popper js?
                        <UncontrolledDropdown>
                          <DropdownToggle
                            caret
                          >
                            select
                          </DropdownToggle>
                          <DropdownMenu
                            container="body"
                            className="dropdown"
                            positionFixed={true}
                          >
                            {modelData[field].enum.map((option) => {
                              {console.log(option)}
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
            setObjectToSend(updateObject);
            setShowCancelModal(true);
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
      <SaveModal
        showCancelModal={showCancelModal}
        setShowCancelModal={setShowCancelModal}
        id={id}
        objectToSend={objectToSend}
      />
    </>
  );
}

export default OneTicket;
