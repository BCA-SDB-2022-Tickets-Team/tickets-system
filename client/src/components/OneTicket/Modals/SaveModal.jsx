import React from 'react'
import {

  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

function SaveModal(props) {
  function handleModifyRequest(e) {
    e.preventDefault();
    fetch(`http://localhost:4000/api/ticket/modify/${props.id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }),
      body: JSON.stringify(props.objectToSend),
    })
      .then((data) => {
        console.log(data);
        return data.json();
      })
      .then((realData) => {
        console.log(realData);
      })
      .catch(Error)
      .then(setTimeout(() => window.location.reload(false), 1000));
  }
  return (
    <Modal isOpen={props.showCancelModal}>
        <ModalHeader>
          Are you sure you want modify a database entry?
        </ModalHeader>
        <ModalBody>This action cannot be undone.</ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={(e)=>{e.preventDefault(); handleModifyRequest(e)}}>
            Modify Ticket
          </Button>
          <Button variant="primary" onClick={() => {window.location.reload(false)}}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
  )
}

export default SaveModal