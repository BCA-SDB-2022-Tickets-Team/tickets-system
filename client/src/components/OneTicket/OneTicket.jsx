import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button } from "reactstrap";
import "./OneTicket.css";
//import SaveCancel from "../Modals/SaveCancel"
import DeleteCancel from "./Modals/DeleteCancel";
import Assign from "./Modals/Assign";

function OneTicket(props) {
  const [oneTicketData, setOneTicketData] = useState([]);
  // need data for selected ticket by id
  const [userRole, setUserRole] = useState("");
  //determine view & options
  const [userId, setUserId] = useState("");
  // need ID for 'claim ticket'
  const [editDisplay, setEditDisplay] = useState("hide");
  const [readDisplay, setReadDisplay] = useState("show");
  // body changes based on read/edit
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  // modals pop up as onClick of 'delete' and 'assign' buttons
  //const [showCancelModal, setShowCancelModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [modelData, setModelData] = useState([]);
  // need data from ticket schema to determine input types for 'edit' toggle
  const notEditable = [
    "_id",
    "Requestor",
    "Assessor",
    "Created At",
    "Updated At",
  ];
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  // ticket id passed as params from allTickets
  const id = params.get("id");
  let updateObject = {};
  // will be body of put request

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
  console.log(oneTicketData);

  function handleModifyRequest(e) {
    e.preventDefault();
    console.log(updateObject);
    setReadDisplay("show");
    setEditDisplay("hide");

    fetch(`http://localhost:4000/api/ticket/modify/${id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }),
      body: JSON.stringify(updateObject),
    })
      .then((data) => {
        console.log(data);
        return data.json();
      })
      .then((realData) => {
        console.log(realData);
      })
      .catch(Error)
      .then(setTimeout(() => navigate(0), 1000));
  }
  function claimTicket() {
    fetch(`http://localhost:4000/api/ticket/modify/${id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }),
      // body: JSON.stringify({ Assessor: userId }),
      body: localStorage.getItem("updateObject"),
    })
      .then((data) => {
        console.log(data);
        return data.json();
      })
      .then((realData) => {
        console.log(realData);
      })
      .catch(Error)
      .then();
  }

  function deleteTicket() {
    fetch(`http://localhost:4000/api/ticket/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        // Indicates the content
      },
    })
      .then((data) => {
        console.log(data);
        return data.json();
      })
      .then((realData) => {
        console.log(realData);
      })
      .catch(Error)
      .then(
        setTimeout(() => {
          navigate("/alltickets");
        }, 1000)
      );
  }

  return (
    <>
      <DeleteCancel
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        deleteTicket={deleteTicket}
      />
      <Assign
        showAssignModal={showAssignModal}
        setShowAssignModal={setShowAssignModal}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
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
            {oneTicketData.Assessor ? (
              <Button
                color="info"
                className={readDisplay}
                onClick={() => {setShowAssignModal(true); setIsDropdownOpen(true)}}
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
            return (
              <tr key={field}>
                <td>{field}:</td>
                <td>
                  {!notEditable.includes(field) ? (
                    <input
                      onChange={(e) => {
                        updateObject[field] = e.target.value;
                        localStorage.setItem("updateObject", `${updateObject}`);
                      }}
                      defaultValue={oneTicketData[field]}
                    />
                  ) : (
                    oneTicketData[field]
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className="button-bar">
        <Button
          color="info"
          className={editDisplay}
          onClick={handleModifyRequest}
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
      {/* <SaveCancel showCancelModal={showCancelModal} handleModifyRequest={handleModifyRequest} /> */}
    </>
  );
}

export default OneTicket;
