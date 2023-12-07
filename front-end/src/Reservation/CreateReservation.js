import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";

function CreateReservation() {
    const history = useHistory();

    const [ first_name, setFirstName ] = useState("");
    const [ last_name, setLastName ] = useState("");
    const [ mobile_number, setMobileNumber] = useState("");
    const [ reservation_date, setReservationDate ] = useState("");
    const [ reservation_time, setReservationTime ] = useState("");
    const [ people, setPeople ] = useState(1)
    const [error, setError] = useState(null)

    useEffect(() => {
        setError(null)
    },[])

    // Change handlers for input boxes
    const handleFirstNameChildStateChange = (childState) => {
        setFirstName(childState);
    }

    const handleLastNameChildStateChange = (childState) => {
        setLastName(childState);
    }

    const handleMobileNumberChildStateChange = (childState) => {
        setMobileNumber(childState);
    }

    const handleReservationDateChildStateChange = (childState) => {
        setReservationDate(childState);
    }

    const handleReservationTimeChildStateChange = (childState) => {
        setReservationTime(childState);
    }

    const handlePeopleChildStateChange = (childState) => {
        setPeople(Number(childState));
    }

    // Handlers for buttons
    function cancelHandler() {
        history.goBack()
    }

    const submitHandler = async(event) => {
        event.preventDefault();

        const abortController = new AbortController();

        try {
            const reservation = await createReservation({first_name, last_name, mobile_number, reservation_date, reservation_time, people}, abortController.signal)
            history.push(`/dashboard?date=${reservation.reservation_date}`)
        } catch (error) {
            setError(error)
        }

        return () => abortController.abort();
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                <ReservationForm onFirstNameStateChange={handleFirstNameChildStateChange} onLastNameStateChange={handleLastNameChildStateChange} onMobileNumberStateChange={handleMobileNumberChildStateChange} onReservationDateChange={handleReservationDateChildStateChange} onReservationTimeChange={handleReservationTimeChildStateChange} onPeopleChange={handlePeopleChildStateChange}/>
                <button type="submit">Submit</button>
                <button type="button" onClick={cancelHandler}>Cancel</button>
            </form>
            <ErrorAlert error={error} />
        </div>
    )
}

export default CreateReservation;