import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button } from "reactstrap";
import "./OneTicket.css";

function OneTicket(props) {
  const [oneTicketData, setOneTicketData] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [editDisplay, setEditDisplay] = useState("hide");
  const [readDisplay, setReadDisplay] = useState("show");
  const notEditable = [
    "_id",
    "Requestor",
    "Assessor",
    "Created At",
    "Updated At",
  ];
  let updateTicketBody = {};
  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')

  useEffect(() => {
    async function getData() {
      let res = await fetch(
        `http://localhost:4000/api/ticket/${id}`,
        {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }),
        }
      );
      let data = await res.json();
      setOneTicketData(data);
    }
    getData();

    setUserRole(localStorage.getItem("role"));
  }, []);

  function handleSubmit(e){
    setReadDisplay("show");
    setEditDisplay("hide");
    console.log(updateTicketBody)
    fetch(
        `http://localhost:4000/api/ticket/modify/${id}`,
        {
          method: "PUT",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }),
          body: JSON.stringify({updateTicketBody})
        }
      ).then((data) => {
        console.log(data)
        return data.json()
      })
      .then((realData) => {
        console.log(realData)
      })
      .catch(Error)
}

  return (
    <>
      {userRole === "3" || userRole === "4" ? (
        <Button
          color="info"
          className={readDisplay}
          onClick={() => {
            setReadDisplay("hide");
            setEditDisplay("show");
          }}
          outline
        >
          Edit
        </Button>
      ) : null}
      
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
                  {!notEditable.includes(field) 
                  ? <input 
                      onChange={(e) => {
                        updateTicketBody[field] = e.target.value;
                        console.log(updateTicketBody)
                      }}
                      placeholder={oneTicketData[field]}
                    />
                   : oneTicketData[field]
                  }
                  )
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Button
        color="info"
        className={editDisplay}
        onClick={handleSubmit}>
            Save
      </Button>
    </>
  );
}

export default OneTicket;
