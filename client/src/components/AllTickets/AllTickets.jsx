import React, { useEffect, useState, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Table, Container, Row, Col, Label, Input } from "reactstrap"
import { LoginContext } from '../../index'
import "./AllTickets.css"
import FilterCheckBoxes from './TicketFilters'


function AllTickets(props) {
    const { sessionRole, sessionToken } = useContext(LoginContext);
    const [role, setRole] = useState(parseInt(sessionRole));

    useEffect(() => {

        setRole(parseInt(sessionRole));

    }, []);

    return (
        <Container>
            <Row>
                <FilterCheckBoxes />
            </Row>
        </Container>
    )
}

export default AllTickets