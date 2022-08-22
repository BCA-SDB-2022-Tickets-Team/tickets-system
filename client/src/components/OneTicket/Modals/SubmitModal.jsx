import React from 'react'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
  } from "reactstrap";

function SubmitModal(props) {
    function submitTicket(){
        fetch(`http://localhost:4000/api/ticket/modify/${props.id}`, {
            method: "PUT",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }),
            body: JSON.stringify({
                Status: "director-review"
            }),
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
    <Modal isOpen={props.showSubmitModal}>
        <ModalHeader>Are you sure you want to submit ticket?</ModalHeader>
        <ModalBody>The ticket will now be reviewed by a director.</ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={submitTicket}>
            Submit Ticket
          </Button>
          <Button variant="primary" onClick={() => props.setShowSubmitModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
  )
}

export default SubmitModal