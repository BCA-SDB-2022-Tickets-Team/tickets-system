import React, { useEffect, useState, useContext } from 'react'
import { Route, Routes, NavLink, Navigate, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col, Label, Input } from "reactstrap"
import { LoginContext } from '../../index'
import "./AllTickets.css"
import TicketsTable from './TicketsTable'
import OneTicket from '../OneTicket/OneTicket';


function AllTickets(props) {
    const { sessionRole, sessionToken, sessionId } = useContext(LoginContext);
    const [role, setRole] = useState(parseInt(sessionRole));

    useEffect(() => {

        setRole(parseInt(sessionRole));

    }, []);

    const [filters, setFilters] = useState(['all'])

    // reference: https://medium.com/codex/handling-checkboxes-in-react-3a2514b140d2
    const onChange = (e) => {
        const isChecked = e.target.checked
        if (isChecked) {
            setFilters([...filters, e.target.value])
        } else {
            const filterIndex = filters.indexOf(e.target.value)
            filters.splice(filterIndex, 1)
            setFilters([...filters, filters])
        }
    }

    const [ticketId, setTicketId] = useState("");

    return (
        <>
            <Routes>
                <Route
                    path="/oneticket"
                    element={
                        <OneTicket ticketId={ticketId} sessionId={sessionId} />} />
            </Routes>

            <Container>
                <Row>
                    <Col className="ticket-filters" xs="2">
                        <h4>Filter Tickets</h4>
                        <Label>
                            <Input
                                name="all"
                                value="all"
                                defaultChecked={true}
                                onChange={onChange}
                                type="checkbox"
                            />
                            All Tickets
                        </Label>
                        <Label>
                            <Input
                                name="new-request"
                                value="new-request"
                                onChange={onChange}
                                type="checkbox"
                            />
                            New Request
                        </Label>
                        <Label>
                            <Input
                                name="questionaire-sent"
                                value="questionaire-sent"
                                onChange={onChange}
                                type="checkbox"
                            />
                            Questionaire Sent
                        </Label>
                        <Label>
                            <Input
                                name="questionaire-received"
                                value="questionaire-received"
                                onChange={onChange}
                                type="checkbox"
                            />
                            Questionnaire Received
                        </Label>
                        <Label>
                            <Input
                                name="in-progress"
                                value="in-progress"
                                onChange={onChange}
                                type="checkbox"
                            />
                            In Progress
                        </Label>
                        <Label>
                            <Input
                                name="on-hold"
                                value="on-hold"
                                onChange={onChange}
                                type="checkbox"
                            />
                            On Hold (Vendor)
                        </Label>
                        <Label>
                            <Input
                                name="director-review'"
                                value="director-review'"
                                onChange={onChange}
                                type="checkbox"
                            />
                            Review (Director)
                        </Label>
                        <Label>
                            <Input
                                name="requestor-review'"
                                value="requestor-review'"
                                onChange={onChange}
                                type="checkbox"
                            />
                            Review (Requestor)
                        </Label>
                        <Label>
                            <Input
                                name="completed"
                                value="completed"
                                onChange={onChange}
                                type="checkbox"
                            />
                            Completed
                        </Label>
                    </Col>
                    <Col>
                        <TicketsTable filters={filters} setTicketId={setTicketId} />
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default AllTickets