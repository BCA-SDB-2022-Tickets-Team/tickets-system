import React, { useState, useEffect } from 'react'

function TicketView() {

    const [ticketStatus, setTicketStatus] = useState("")

    const [newFilter, setNewFilter] = useState(false)
    const [questionnaireSentFilter, setQuestionnaireSentFilter] = useState(false)
    const [inProgressFilter, setInProgressFilter] = useState(false)
    const [onHoldFilter, setOnHoldFilter] = useState(false)
    const [directorFilter, setDirectorFilter] = useState(false)
    const [requestorFilter, setRequestorFilter] = useState(false)
    const [completedFilter, setCompletedFilter] = useState(false)


    // Update checkbox status function (ref: https://medium.com/programming-essentials/how-to-manage-a-checkbox-with-react-hooks-f8c3d973eeca)
    function toggle(value) {
        return !value;
    }

    return (
        <>
            <div classname="filters">
                <fieldset>
                    <legend>Filters:</legend>
                    <input
                        type="checkbox"
                        name="new"
                        checked={newFilter}
                        onChange={() => setNewFilter(toggle)} />
                    <label htmlFor="new">New Requests</label>
                    <input
                        type="checkbox"
                        name="questionnaire-sent"
                        checked={questionnaireSentFilter}
                        onChange={() => setQuestionnaireSentFilter(toggle)} />
                    <label htmlFor="questionnaire-sent">Questionnaire Sent</label>
                    <input
                        type="checkbox"
                        name="in-progress"
                        checked={inProgressFilter}
                        onChange={() => setInProgessFilter(toggle)} />
                    <label htmlFor="in-progress">In Progress</label>
                    <input
                        type="checkbox"
                        name="on-hold"
                        checked={onHoldFilter}
                        onChange={() => setOnHoldFilter(toggle)} />
                    <label htmlFor="on-hold">On Hold</label>
                    <input
                        type="checkbox"
                        name="director"
                        checked={directorFilter}
                        onChange={() => setDirectorFilter(toggle)} />
                    <label htmlFor="director">Director Review</label>
                    <input
                        type="checkbox"
                        name="requestor"
                        checked={requestorFilter}
                        onChange={() => setRequestorFilter(toggle)} />
                    <label htmlFor="requestor">Requestor Review</label>
                    <input
                        type="checkbox"
                        name="completed"
                        checked={completedFilter}
                        onChange={() => setCompletedFilter(toggle)} />
                    <label htmlFor="completed">Completed</label>
                </fieldset>
            </div>
            <div className="tickets">

            </div>
            <div className="one-ticket">

            </div>
        </>
    )
}

export default TicketView