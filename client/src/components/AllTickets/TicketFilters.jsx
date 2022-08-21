// reference: https://medium.com/codex/handling-checkboxes-in-react-3a2514b140d2
import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Col, Label, Input } from "reactstrap"
import TicketsTable from './TicketsTable'

class FilterCheckBoxes extends Component {

    state = { filters: ['all'] }

    onChange = (e) => {
        const isChecked = e.target.checked
        if (isChecked) {
            this.setState({ filters: [...this.state.filters, e.target.value] })
        } else {
            const filterIndex = this.state.filters.indexOf(e.target.value)
            this.state.filters.splice(filterIndex, 1)
            this.setState({ filters: [...this.state.filters, this.state.filters] })
        }
    }

    render() {
        return (
            <>
                <Col className="ticket-filters" xs="2">
                    <h4>Filter Tickets</h4>
                    <Label>
                        <Input
                            name="all"
                            value="all"
                            defaultChecked={true}
                            onChange={this.onChange}
                            type="checkbox"
                        />
                        All Tickets
                    </Label>
                    <Label>
                        <Input
                            name="new-request"
                            value="new-request"
                            onChange={this.onChange}
                            type="checkbox"
                        />
                        New Request
                    </Label>
                    <Label>
                        <Input
                            name="questionaire-sent"
                            value="questionaire-sent"
                            onChange={this.onChange}
                            type="checkbox"
                        />
                        Questionaire Sent
                    </Label>
                    <Label>
                        <Input
                            name="questionaire-received"
                            value="questionaire-received"
                            onChange={this.onChange}
                            type="checkbox"
                        />
                        Questionnaire Received
                    </Label>
                    <Label>
                        <Input
                            name="in-progress"
                            value="in-progress"
                            onChange={this.onChange}
                            type="checkbox"
                        />
                        In Progress
                    </Label>
                    <Label>
                        <Input
                            name="on-hold"
                            value="on-hold"
                            onChange={this.onChange}
                            type="checkbox"
                        />
                        On Hold (Vendor)
                    </Label>
                    <Label>
                        <Input
                            name="director-review'"
                            value="director-review'"
                            onChange={this.onChange}
                            type="checkbox"
                        />
                        Review (Director)
                    </Label>
                    <Label>
                        <Input
                            name="requestor-review'"
                            value="requestor-review'"
                            onChange={this.onChange}
                            type="checkbox"
                        />
                        Review (Requestor)
                    </Label>
                    <Label>
                        <Input
                            name="completed"
                            value="completed"
                            onChange={this.onChange}
                            type="checkbox"
                        />
                        Completed
                    </Label>
                </Col>
                <Col>
                    <TicketsTable filters={this.state.filters} />
                </Col>
            </>
        )
    }
}

export default FilterCheckBoxes