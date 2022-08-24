import React, { useEffect, useState, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Table } from "reactstrap"
import "./AllTickets.css"
import { LoginContext } from '../../index';


const TicketsTable = (props) => {

    const { sessionRole, sessionToken } = useContext(LoginContext);
    const [role, setRole] = useState(parseInt(sessionRole));

    const [ticketData, setTicketData] = useState([])
    const [ticketFieldHeadings, setTicketFieldHeadings] = useState([])

    //const [color, setColor] = useState("")

    const colorCodes = {
        'New Request': "#FFE45E",
        'Triage': "#2D7D90",
        'In Progress': "#58C4C6",
        'On-Hold (Vendor)': "#EF798A",
        'Review (Director)': "#48B89F",
        'Review (Requestor)': "#88E1B0",
        'Completed': "#C7f9CC"
    }

    useEffect(() => {

        console.log(props.filters)

        async function getData() {

            let res = await fetch("http://localhost:4000/api/ticket/all", {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    Authorization: sessionToken,
                })
            });

            res.json()
                .then(data => {
                    return data.allTicketsData.map(ticket => {
                        if (role === 4) {
                            return {
                                _id: ticket._id,
                                'Ticket ID': ticket.ID,
                                'Status': ticket.Status,
                                'Vendor Name': ticket['Vendor Name'],
                                'Assessor': !ticket.Assessor
                                    ? <em>Unassigned</em>
                                    : data.allUsers.map(user => {
                                        if (ticket.Assessor === user._id) {
                                            return `${user.firstName} ${user.lastName}`
                                        }
                                    }),
                                'Requestor': !ticket.Requestor
                                    ? <em>Unassigned</em>
                                    : data.allUsers.map(user => {
                                        if (ticket.Requestor === user._id) {
                                            return `${user.firstName} ${user.lastName}`
                                        }
                                    }),
                                'Created': ticket['Created At'],
                                'Updated': ticket['Updated At'],
                            }
                        } else {
                            return {
                                _id: ticket._id,
                                'Ticket ID': ticket.ID,
                                'Status': ticket.Status,
                                'Vendor Name': ticket['Vendor Name'],
                                'Assessor': !ticket.Assessor
                                    ? <em>Unassigned</em>
                                    : data.allUsers.map(user => {
                                        if (ticket.Assessor === user._id) {
                                            return `${user.firstName} ${user.lastName}`
                                        }
                                    }),
                                'Requestor': !ticket.Requestor
                                    ? <em>Unassigned</em>
                                    : data.allUsers.map(user => {
                                        if (ticket.Requestor === user._id) {
                                            return `${user.firstName} ${user.lastName}`
                                        }
                                    }),
                                'Created': ticket['Created At'],
                            }
                        }
                    }
                    )
                })
                .then(mappedData => {
                    if (props.filters.includes('All')) {
                        let excludeCompleted = mappedData.filter(ticket => ticket.Status !== 'Completed')
                        setTicketData(excludeCompleted)
                        return mappedData
                    } else {
                        function filterByStatus(ticket) {
                            if (props.filters.includes(ticket.Status)) {
                                return true
                            } else {
                                return false
                            }
                        }
                        let filteredData = mappedData.filter(filterByStatus)
                        setTicketData(filteredData)
                        return mappedData
                    }
                })
                .then(mappedData => {
                    setTicketFieldHeadings(Object.keys(mappedData[0]))
                })
        }
        getData();
    }, [props.filters]);

    let ticketsToPrint;

    return (
        <Table responsive hover>
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
                        <tr key={ticket['Created At']} style={{ backgroundColor: colorCodes[ticket.Status] }}>
                            {contentKeys.map(field => {
                                if (field !== "_id") {
                                    return (
                                        <td className="all-tickets-data" key={field} >
                                            <NavLink onClick={props.setTicketId(ticket._id)} to={`/oneticket?id=${ticket['_id']}`}>
                                                {field === 'Created' || field === 'Updated'
                                                    ? <span style={{ fontSize: '10pt' }}>{new Date(ticket[field]).toLocaleDateString()} - {new Date(ticket[field]).toLocaleTimeString(navigator.language, {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}</span>
                                                    : ticket[field]}
                                            </NavLink>
                                        </td>
                                    )
                                }
                            })}
                        </tr>

                    )

                })}
            </tbody>
        </Table>
    )
}

export default TicketsTable