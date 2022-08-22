import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { LoginContext } from "../../../index";
import "./Assign.css";

function AssignModal(props) {
  const { sessionToken } = useContext(LoginContext);
  const [newAssessor, setNewAssessor] = useState("");

  const [allUsers, setAllUsers] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    async function getAllUsers() {
      try {
        let allUsersResponse = await fetch(
          `http://localhost:4000/api/user/allusers`,
          {
            method: "GET",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: sessionToken,
            }),
          }
        );
        if (allUsersResponse.ok) {
          await allUsersResponse
            .json()
            .then((data) => {
              setAllUsers(data.allUsers);
            })
            .catch((err) => console.log(err));
        } else {
          let errorMsg = await allUsersResponse.json();
          console.log(`error getting /allusers: `, allUsersResponse);
          throw new Error(errorMsg.status);
        }
      } catch (error) {
        console.log(`awww shucks: `, error);
      }
    }
    getAllUsers();
  }, []);

  function assignTicket() {
    console.log(newAssessor, "fetch function");
    fetch(`http://localhost:4000/api/ticket/modify/${props.id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }),
      // body: JSON.stringify({ Assessor: userId }),
      body: JSON.stringify({
        Assessor: newAssessor,
        Status: 'Triage'
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
      .then()
      .then(window.location.reload(false));
  }

  return (
    <Modal isOpen={props.showAssignModal}>
      <ModalHeader>Assign Assessor to Ticket: </ModalHeader>
      <ModalBody className="modal-body">
        <Dropdown direction={"down"} isOpen={openDropdown}>
          <DropdownToggle
            onClick={() => {
              setOpenDropdown(!openDropdown);
            }}
            caret
          >
            All Assessors
          </DropdownToggle>
          <DropdownMenu container="body" className="dropdown">
            {allUsers.map((user) => {
              if (user.__type === "asrUser") {
                return (
                  <DropdownItem
                    onClick={() => {
                      setNewAssessor(user._id);
                      setOpenDropdown(false);
                    }}
                  >
                    {`${user.firstName} ${user.lastName}`}
                  </DropdownItem>
                );
              }
            })}
          </DropdownMenu>
        </Dropdown>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="secondary"
          onClick={() => {
            props.setShowAssignModal(false);
            assignTicket();
          }}
        >
          Set Assessor
        </Button>

        <Button
          variant="primary"
          onClick={() => {
            props.setShowAssignModal(false);
          }}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default AssignModal;
