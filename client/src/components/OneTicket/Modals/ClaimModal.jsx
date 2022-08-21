import React from 'react'
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    
  } from 'reactstrap'

function ClaimModal(props) {

    function claimTicket() {
        fetch(`http://localhost:4000/api/ticket/modify/${props.id}`, {
          method: "PUT",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }),
          // body: JSON.stringify({ Assessor: props.userId }),
          body: JSON.stringify({
            Assessor: props.userId,
            Status: 'triage'
          }),
        })
          .then((data) => {
            return data.json();
          })
          .then((realData) => {
            console.log(realData);
          })
          .catch(Error)
          .then(window.location.reload(false));
      }
  return (
    <Modal isOpen={props.showClaimModal}>
        <ModalHeader>Are you sure you want to claim ticket?</ModalHeader>
        <ModalBody>You will be assigned as its Assessor.</ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={claimTicket}>
            Claim Ticket
          </Button>
          <Button variant="primary" onClick={() => props.setShowClaimModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
  )
}

export default ClaimModal