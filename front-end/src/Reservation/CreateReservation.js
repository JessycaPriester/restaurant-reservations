import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import { createReservation } from "../utils/api";
import Dashboard from "../dashboard/Dashboard";

function CreateReservation() {
    const history = useHistory();

    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ mobileNumber, setMobileNumber] = useState("");
    const [ reservationDate, setReservationDate ] = useState("");
    const [ reservationTime, setReservationTime ] = useState("");
    const [ partySize, setPartySize ] = useState(1)

    // Change handlers for input boxes
    const handleFirstNameChange = (event) => setFirstName(event.target.value)
    const handleLastNameChange = (event) => setLastName(event.target.value);
    const handleMobileNumberChange = (event) => setMobileNumber(event.target.value);
    const handleReservationDateChange = (event) => setReservationDate(event.target.value);
    const handleReservationTimeChange= (event) => setReservationTime(event.target.value);
    const handlePartySizeChange = (event) => setPartySize(event.target.value);

    // Handlers for buttons
    function cancelHandler() {
        history.goBack()
    }

    const submitHandler = async(event) => {
        event.preventDefault();
        const reservation = await createReservation({firstName, lastName, mobileNumber, reservationDate, reservationTime, partySize})
        history.push(`dashboard/${reservation.reservation_date}`)
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                <label htmlFor="first_name">
                    First Name
                    <input required type="text" id="first_name" name="first_name" onChange={handleFirstNameChange} />
                </label>
                <label htmlFor="last_name">
                    Last Name
                    <input required type="text" id="last_name" name="last_name" onChange={handleLastNameChange} />
                </label>
                <lable htmlFor="mobile_number">
                    Mobile Number
                    <input required type="text" id="mobile_number" name="mobile_number" onChange={handleMobileNumberChange} />
                </lable>
                <label htmlFor="reservation_date">
                    Reservation Date
                    <input required type="date" id="reservation_date" name="reservation_date" onChange={handleReservationDateChange} />
                </label>
                <label htmlFor="reservation_time">
                    Reservation Time
                    <input required type="time" id="reservation_time" name="reservation_time" min="00:00" max="23:59" onChange={handleReservationTimeChange} />
                </label>
                <label htmlFor="people">
                    Party Size
                    <input required type="number" id="people" name="people" min="1" onChange={handlePartySizeChange} />
                </label>
                <button type="submit">Submit</button>
                <button type="button" onClick={cancelHandler}>Cancel</button>
            </form>
        </div>
    )
}

export default CreateReservation;