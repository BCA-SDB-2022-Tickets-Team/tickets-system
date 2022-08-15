import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Table } from "reactstrap"


function AllTickets() {
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
        <Table>
            <tbody>
                <tr>
                    {ticketFieldHeadings.map(heading => {
                        return (
                            <th key={heading}>{heading}</th>
                        )
                    })}
                </tr>
                {/* Map over the tickets and display them in a table */}
                {ticketData.map((ticket) => {
                    let contentKeys = Object.keys(ticket)
                    return (
                        <tr key={ticket['Created At']}>
                            {contentKeys.map(field => {
                                return (
                                    <td key={field}>{ticket[field]}</td>
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}

export default AllTickets