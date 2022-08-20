import React from 'react'
import { useNavigate } from 'react-router-dom';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
  } from "reactstrap";
  

function DeleteModal(props) {
  const navigate=useNavigate()
  
  function deleteTicket() {
    fetch(`http://localhost:4000/api/ticket/delete/${props.id}`, {
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
      .then(
        setTimeout(() => {
          navigate("/alltickets");
        }, 1000)
      );
  }
  return (
    <Modal isOpen={props.showDeleteModal}>
        <ModalHeader>Are you sure you want to delete ticket?</ModalHeader>
        <ModalBody>This action cannot be undone.</ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={deleteTicket}>
            Delete Ticket
          </Button>
          <Button variant="primary" onClick={() => props.setShowDeleteModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
  )
}

export default DeleteModal