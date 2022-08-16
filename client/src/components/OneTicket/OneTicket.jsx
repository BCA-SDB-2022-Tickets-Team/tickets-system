import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Table, Button } from "reactstrap"

function OneTicket(props) {

    const [oneTicketData, setOneTicketData] = useState([])
    const [userRole, setUserRole] = useState("")

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

    useEffect(() => {
        setUserRole(localStorage.getItem('role'))
    })

    return (
        <>
            {userRole === "3" || userRole === "4"
                ? <Button color="info" outline>Edit</Button>
                : null
            }
            <Table striped>
                <tbody>
                    {/* Map over the ticket and display its data in a table */}
                    {Object.keys(oneTicketData).map(field => {
                        return (
                            <tr key={field}>
                                <td>{field}:</td>
                                <td>{oneTicketData[field]}</td>
                            </tr>
                        )
                    }
                    )}
                </tbody>
            </Table>
        </>
    )
}

export default OneTicket