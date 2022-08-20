import React, { useEffect, useState, useContext } from 'react'
import {
  Table,
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
import { LoginContext } from '../../../index';

function Assign(props) {
  const { sessionToken } = useContext(LoginContext);
 const {assessor, setAssessor} = useState()

  const [allUsers, setAllUsers] = useState([]);

useEffect(()=>{
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
          console.log(`allusers response:`, allUsersResponse);
          await allUsersResponse
            .json()
            .then((data) => {
              console.log(data);
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
  
console.log(allUsers)
  return (
    <Modal isOpen={props.showAssignModal}>
        <ModalHeader>Assign Assessor to Ticket: </ModalHeader>
        <ModalBody>
          <Dropdown
          direction={"down"}
          isOpen={props.isDropdownOpen}
          >
            <DropdownToggle caret>All Assessors</DropdownToggle>
            <DropdownMenu container="body">
                      {allUsers.map((user) => {
                        return (
                          <DropdownItem
                            onClick={() => setAssessor(user['_id'])}
                          >
                            {`${user.firstName} ${user.lastName}`}
                          </DropdownItem>
                        );
                      })
                   
                    }
                    </DropdownMenu>

          </Dropdown>
        </ModalBody>
        <ModalFooter>

          <Button variant="secondary" onClick={()=>{
            props.setShowAssignModal(false)
            props.navigate(0)
          }}>
            Set Assessor
          </Button>

          <Button variant="primary" onClick={() => props.setShowAssignModal(false)}>
            Cancel
          </Button>

        </ModalFooter>
      </Modal>
  )
}

export default Assign