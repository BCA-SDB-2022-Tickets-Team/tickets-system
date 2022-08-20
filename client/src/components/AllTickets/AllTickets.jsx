import React, { useEffect, useState, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Table, Container, Row, Col, Label, Input } from "reactstrap"
import { LoginContext } from '../../index'
import "./AllTickets.css"


function AllTickets(props) {
    const { sessionRole, sessionToken } = useContext(LoginContext);
    const [role, setRole] = useState(parseInt(sessionRole));

    const [allUsers, setAllUsers] = useState(undefined);

    const [ticketData, setTicketData] = useState([])
    const [ticketFieldHeadings, setTicketFieldHeadings] = useState([])

    const reqFilterOptions = [
        'New Request',
        'In Progress',
        'Review',
        'Complete']
    const asrFilterOptions = [
        'New Request',
        'In Progress',
        'On Hold (Vendor)',
        'Review (Director)',
        'Review (Requestor)',
        'Complete']


    /*     useEffect(() => {
    
            setRole(parseInt(sessionRole));
    
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
        }) */

    useEffect(() => {

        setRole(parseInt(sessionRole));

        async function getData() {
            let res = await fetch("http://localhost:4000/api/ticket/all", {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                })
            });
            res.json()
                .then(data => {
                    return data.map(ticket => {
                        return {
                            _id: ticket._id,
                            'Created At': ticket['Created At'],
                            'Vendor Name': ticket['Vendor Name'],
                            //'Assessor': !ticket.Assessor ? 'Unassigned' : allUsers.find(user => user._id === ticket.Assessor),
                            'Updated At': ticket['Updated At'],
                        }
                    })
                })
                .then(mappedData => {
                    console.log(mappedData)
                    setTicketData(mappedData)
                    return mappedData
                })
                .then((mappedTicketData) => {
                    console.log(mappedTicketData)
                    setTicketFieldHeadings(Object.keys(mappedTicketData[0]))
                })
        
            }
            getData();
            //console.log(allUsers)
        }, []);



    return (
        <Container>
            <Row>
                <Col className="ticket-filters" xs="2">
                    <h4>Filter Tickets</h4>
                    {role === 1 || role === 2
                        ? reqFilterOptions.map(option => {
                            return (
                                <Label>
                                    <Input name={option} type="checkbox" />{option}
                                </Label>
                            )
                        })
                        : asrFilterOptions.map(option => {
                            return (
                                <Label>
                                    <Input type="checkbox" />{option}
                                </Label>
                            )
                        })}
                </Col>
                <Col>
                    <Table striped responsive hover>
                        <tbody>
                            <tr>
                                {/* Map over the ticket field headings and display as table headings */}
                                {ticketFieldHeadings.map(heading => {
                                    if (heading !== "_id") {
                                        return (
                                            <th className="all-tickets-headings" key={heading}>{heading}</th>
                                        )
                                    }
                                })}
                            </tr>
                            {/* Map over the tickets and display their data in a table */}
                            {ticketData.map((ticket) => {
                                let contentKeys = Object.keys(ticket)
                                return (
                                    <tr key={ticket['Created At']} >
                                        {contentKeys.map(field => {
                                            if (field !== "_id") {
                                                return (
                                                    <td className="all-tickets-data" key={field} >
                                                        <NavLink onClick={props.setTicketID(ticket._id)} to={`/oneticket?id=${ticket['_id']}`}>
                                                            {field === 'Created At' || field === 'Updated At'
                                                                ? new Date(ticket[field]).toLocaleDateString()
                                                                : ticket[field]}</NavLink>
                                                        {/* <NavLink onClick={props.setTicketID(ticket["_id"])} to="/oneticket">{ticket[field]}</NavLink> */}
                                                    </td>
                                                )
                                            }
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    )
}

export default AllTickets