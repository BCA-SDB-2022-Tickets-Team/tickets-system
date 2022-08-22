import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

function UpdateStatusModal(props) {
  let objectToSend = props.objectToSend
  function handleUpdateRequest() {
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
    <Modal
    isOpen={props.showUpdateStatusModal}>
      <ModalHeader>Change ticket status?</ModalHeader>
      <ModalBody>
        {`New Status: ${objectToSend['Status']}`}
      </ModalBody>
      <ModalFooter>
        <Button
          variant="secondary"
          onClick={(e) => {
            e.preventDefault();
            handleUpdateRequest();
          }}
        >
          Change Status
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            window.location.reload(false);
          }}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default UpdateStatusModal;
