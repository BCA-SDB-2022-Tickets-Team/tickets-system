import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Table } from "reactstrap"
import "./AllTickets.css"


function AllTickets(props) {
    const [ticketData, setTicketData] = useState([])
    const [ticketFieldHeadings, setTicketFieldHeadings] = useState([])
    

    useEffect(() => {
        async function getData() {
            let res = await fetch("http://localhost:4000/api/ticket/all", {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                })
            });
            let data = await res.json();
            setTicketData(data);
            setTicketFieldHeadings(Object.keys(data[0]))
        }
        getData();
    }, []);


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
                                            <NavLink onClick={props.setTicketID(ticket._id)} to={`/oneticket?id=${ticket['_id']}`}>{ticket[field]}</NavLink>
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
    )
}

export default AllTickets