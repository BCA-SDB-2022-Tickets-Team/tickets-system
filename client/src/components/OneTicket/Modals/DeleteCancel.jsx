import React from 'react'
import {
    Table,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
  } from "reactstrap";
  

function DeleteCancel(props) {
  return (
    <Modal isOpen={props.showDelete}>
        <ModalHeader>Are you sure you want to delete ticket?</ModalHeader>
        <ModalBody>This action cannot be undone.</ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={props.deleteTicket}>
            Delete Ticket
          </Button>
          <Button variant="primary" onClick={() => props.setShowDeleteModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
  )
}

export default DeleteCancel