import React, { useEffect, useState } from "react";
import DeleteCancel from "./Modals/DeleteCancel";
//import SaveCancel from "../Modals/SaveCancel"
/* 
  - Tried setting up a modal to check before submitting changes,  but every time the modal popped up updateObject reset to {}
  - I tried adding updateObject to local storage, in hopes that it would persist, but even then... modal messes it up
  - So for now... no modal

*/
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import "./OneTicket.css";

function OneTicket(props) {
  const [oneTicketData, setOneTicketData] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [editDisplay, setEditDisplay] = useState("hide");
  const [readDisplay, setReadDisplay] = useState("show");
  const [showDelete, setShowDelete] = useState(false);
  //const [storedObject, setStoredObject] = useState()
  //const [showCancel, setShowCancel] = useState(false);

  const notEditable = [
    "_id",
    "Requestor",
    "Assessor",
    "Created At",
    "Updated At",
  ];
  let updateObject={}
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

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
  }, []);

  function handleSubmit(e) {
    e.preventDefault()
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
  }
  function claimTicket() {
    fetch(`http://localhost:4000/api/ticket/modify/${id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }),
      // body: JSON.stringify({ Assessor: userId }),
      body : localStorage.getItem('updateObject')
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
  function assignTicket() {
    console.log("assigning");
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
      .then(setTimeout(()=>{window.location.reload(false)}, 1000))
  }

  return (
    <>
      <DeleteCancel showDelete={showDelete} setShowDelete={setShowDelete} deleteTicket={deleteTicket} />

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
            <Button
              color="info"
              className={readDisplay}
              onClick={assignTicket}
              outline
            >
              Assign Ticket
            </Button>
            <Button
              color="info"
              className={readDisplay}
              onClick={() => setShowDelete(true)}
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
                        updateObject[field] = e.target.value
                        localStorage.setItem('updateObject', `${updateObject}`)
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
          onClick={handleSubmit}
        >
          Save
        </Button>
        <Button color="info" className={editDisplay} onClick={() => {window.location.reload(false)}}>
          Cancel
        </Button>
      </div>
      {/* <SaveCancel showCancel={showCancel} handleSubmit={handleSubmit} /> */}
    </>
  );
}

export default OneTicket;
