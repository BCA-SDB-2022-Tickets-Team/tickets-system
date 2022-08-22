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
                    console.log(data)
                    console.log(data.allTicketsData)
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
                    }
                    )
                })
                .then(mappedData => {
                    console.log(props.filters)
                    if (props.filters.includes('all')) {
                        setTicketData(mappedData)
                        console.log(mappedData)
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
                                            <NavLink onClick={props.setTicketId(ticket._id)} to={`/oneticket?id=${ticket['_id']}`}>
                                                {field === 'Created At' || field === 'Updated At'
                                                    ? new Date(ticket[field]).toLocaleDateString()
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