import React from 'react'
import {

  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

function SaveCancel(props) {
  return (
    <Modal isOpen={props.showCancelModal}>
        <ModalHeader>
          Are you sure you want modify a database entry?
        </ModalHeader>
        <ModalBody>This action cannot be undone.</ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={(e)=>{e.preventDefault(); props.handleSubmit(e)}}>
            Modify Ticket
          </Button>
          <Button variant="primary" onClick={() => {window.location.reload(false)}}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
  )
}

export default SaveCancel