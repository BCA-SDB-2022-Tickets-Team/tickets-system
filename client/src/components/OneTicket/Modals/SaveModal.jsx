import React from 'react'
import {

  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

function SaveModal(props) {
  function handleModifyRequest() {
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
    <Modal isOpen={props.showSaveModal}>
        {
          
           <ModalHeader>
            {props.onSwitch 
          ? 'Begin assessment'
          : 'Are you sure you want to modify a database entry?'}
        </ModalHeader>
        }
        <ModalBody>
          {props.onSwitch
          ? 'Ticket status: In Progress'
          : 'This action cannot be undone.'
          }
          </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={(e)=>{e.preventDefault(); handleModifyRequest()}}>
            {props.onSwitch
            ? 'Begin' 
            : 'Modify Ticket'}
          </Button>
          <Button variant="primary" onClick={() => {window.location.reload(false)}}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
  )
}

export default SaveModal