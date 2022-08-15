import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Table } from "reactstrap"

function OneTicket(props) {

    const [oneTicketData, setOneTicketData] = useState([])

    useEffect(() => {
        async function getData() {
            let res = await fetch(`http://localhost:4000/api/ticket/${props.ticketID}`, {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                })
            });
            let data = await res.json();
            setOneTicketData(data);
        }
        getData();
    }, []);

    console.log(oneTicketData)

    return (
        <>

            {/* Map over the ticket and display its data in a table */}
            {Object.keys(oneTicketData).forEach(field => {
                return (
                    <div>{field}</div>
                )
            }
            )}

        </ >
    )
}

export default OneTicket