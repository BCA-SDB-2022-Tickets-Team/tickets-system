import React, { useEffect, useState, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Table, Container, Row, Col, Label, Input } from "reactstrap"
import { LoginContext } from '../../index'
import "./AllTickets.css"


function AllTickets(props) {
    const { sessionRole, sessionToken } = useContext(LoginContext);
    const [role, setRole] = useState(parseInt(sessionRole));

    const [ticketData, setTicketData] = useState([])
    const [ticketFieldHeadings, setTicketFieldHeadings] = useState([])

    const [ticketStatuses, setTicketStatuses] = useState([])

    const [checked, setChecked] = useState(true);

    const reqFilterOptions = [
        'New Request',
        'In Progress',
        'Review',
        'Complete']
    const asrFilterOptions = [
        'new-request',
        'In Progress',
        'On Hold (Vendor)',
        'Review (Director)',
        'Review (Requestor)',
        'Complete']

    const [filters, setFilters] = useState([]);

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
                    return data.allTicketsData.map(ticket => {
                        return {
                            _id: ticket._id,
                            'Ticket ID': ticket.ID,
                            'Assessor': !ticket.Assessor
                                ? <em>Unassigned</em>
                                : data.allUsers.map(user => {
                                    if (ticket.Assessor === user._id) {
                                        return `${user.firstName} ${user.lastName}`
                                    }
                                }),
                            'Created At': ticket['Created At'],
                            'Vendor Name': ticket['Vendor Name'],
                            'Updated At': ticket['Updated At'],
                            'Status': ticket.Status
                        }
                    })
                })
                .then(mappedData => {
                    setTicketData(mappedData)
                    return mappedData
                })
                .then(mappedData => {
                    setTicketFieldHeadings(Object.keys(mappedData[0]))
                })
        }
        getData();
    }, []);

    let selected = [];

    const onFilterChange = e => {
        if (e.target.checked === true) {
            selected.push(e.target.value)
            //setFilters(selected)
            console.log(selected)
        } else {
            let i = 0;
            while (i < selected.length) {
                let filter = selected.pop()
                if (filter.includes(e.target.value) === false) {
                    selected.unshift(filter)
                    i++
                }
                console.log(selected)
                return selected
            }
        }
    }

    //TODO: useeffect that will re-render the table when the status array updates (table might need to be its own component)

    return (
        <Container>
            <Row>
                <Col className="ticket-filters" xs="2">
                    <h4>Filter Tickets</h4>
                    {role === 1 || role === 2
                        ? reqFilterOptions.map(option => {
                            return (
                                <Label>
                                    <Input
                                        name={option}
                                        value={option}
                                        onChange={onFilterChange}
                                        type="checkbox"
                                    />
                                    {option}
                                </Label>
                            )
                        })
                        : asrFilterOptions.map(option => {
                            return (
                                <Label>
                                    <Input
                                        name={option}
                                        value={option}
                                        onChange={onFilterChange}
                                        type="checkbox"
                                    />
                                    {option}
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
                                //if (selected.includes(ticket.Status) || selected == []) {
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
                                                    </td>
                                                )
                                            }
                                        })}
                                    </tr>
                                )
                                //}
                            })}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    )
}

export default AllTickets