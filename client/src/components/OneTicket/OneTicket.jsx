import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "./OneTicket.css";

function OneTicket(props) {
  const [oneTicketData, setOneTicketData] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId ] = useState("")
  const [editDisplay, setEditDisplay] = useState("hide");
  const [readDisplay, setReadDisplay] = useState("show");
  const [show, setShow] = useState(false)
  
  const notEditable = [
    "_id",
    "Requestor",
    "Assessor",
    "Created At",
    "Updated At",
  ];
  let updateTicketBody = {};
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
    setUserId(localStorage.getItem("userId"))
  }, []);

  function handleSubmit(e) {
    setReadDisplay("show");
    setEditDisplay("hide");
    console.log(updateTicketBody);
    fetch(`http://localhost:4000/api/ticket/modify/${id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }),
      body: JSON.stringify(updateTicketBody),
    })
      .then((data) => {
        console.log(data);
        return data.json();
      })
      .then((realData) => {
        console.log(realData);
      })
      .catch(Error);
  }
function claimTicket(){
  fetch(`http://localhost:4000/api/ticket/modify/${id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }),
      body: JSON.stringify({'Assessor': userId}),
    })
      .then((data) => {
        console.log(data);
        return data.json();
      })
      .then((realData) => {
        console.log(realData);
      })
      .catch(Error)
      .then(window.location.reload(false))
    }     
function assignTicket(){
  console.log('assigning')
}

function deleteTicket(){
  
  fetch(`http://localhost:4000/api/ticket/delete/${id}`,
  {method: 'DELETE',
  headers: {
    'Content-type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem("token")}`,
     // Indicates the content 
   }
  }
  )
  .then((data) => {
    console.log(data);
    return data.json();
  })
  .then((realData) => {
    console.log(realData);
  })
  .catch(Error)
}


  return (
    <>
    <Modal isOpen={show}>
      
       <ModalHeader>Are you sure you want to delete ticket?</ModalHeader>
      <ModalBody>This action cannot be undone.</ModalBody>
      <ModalFooter>
        <Button variant="secondary" onClick={deleteTicket}>Delete User</Button>
        <Button variant="primary" onClick={()=>setShow(false)}>Cancel</Button>
        </ModalFooter>
    </Modal>
  
    <div className="button-bar">
    {userRole === "3"
      && !oneTicketData.Assessor
      ? (
        <Button
          color="info"
          className={readDisplay}
          onClick={claimTicket}
          outline
        >
          Claim Ticket
        </Button>)
       : null}

      {(userRole === "3" 
      && userId===oneTicketData.Assessor)
      || userRole === "4" ? (
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
    {
      userRole==="4"
      ? (
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
        onClick={()=>setShow(true)}
        outline
      >
        Delete Ticket
      </Button>
        </>
      ) : null
      }

      
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
                        updateTicketBody[field] = e.target.value;
                      }}
                      placeholder={oneTicketData[field]}
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
      <Button color="info" className={editDisplay} onClick={handleSubmit}>
        Save
      </Button>
    </>
  );
}

export default OneTicket;
