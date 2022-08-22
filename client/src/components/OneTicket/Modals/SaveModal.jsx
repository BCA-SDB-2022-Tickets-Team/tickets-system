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
      .then(setTimeout(() => window.location.reload(false), 500));
  }
  return (
    <Modal isOpen={props.showSaveModal}>
        {
          
           <ModalHeader>
            {props.modifyType==='begin' 
          ? 'Begin assessment'
          : (props.modifyType==='modify' ? 'Are you sure you want to modify a database entry?' : 'Change ticket status?')}
        </ModalHeader>
        }
        <ModalBody>
          {props.modifyType==='begin'
          ? 'Ticket status: In Progress'
          : (props.modifyType==='modify' ? 'This action cannot be undone.' : 'Status: On Hold')
          }
          </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={(e)=>{e.preventDefault(); handleModifyRequest()}}>
            {props.modifyType==='begin'
            ? 'Begin' 
            : (props.modifyType==='modify' ? 'Modify Ticket' : 'Change Status')}
          </Button>
          <Button variant="primary" onClick={() => {window.location.reload(false)}}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
  )
}

export default SaveModal