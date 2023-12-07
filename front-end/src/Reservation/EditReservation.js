import React, {useEffect, useState} from "react";
import { useHistory, useParams  } from "react-router-dom";

import { readReservation, updateReservation, handleEditedReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";


function EditReservation() {
    const history = useHistory();
    
    const [reservation, setReservation] = useState([])
    const [ first_name, setFirstName ] = useState("");
    const [ last_name, setLastName ] = useState("");
    const [ mobile_number, setMobileNumber] = useState("");
    const [ reservation_date, setReservationDate ] = useState("");
    const [ reservation_time, setReservationTime ] = useState("");
    const [ people, setPeople ] = useState(1)
    const [error, setError] = useState(null)

    // Find the reservation with the id from the params
    // Update the states to the values that are from the form 
    // Update the reservation with those values

    // Find the reservation with the id in the params
    const params = useParams()
    const reservation_id = Number(params.reservation_id)

    useEffect(() => {
        const abortController = new AbortController();
        setError(null)

        readReservation(reservation_id, abortController.signal)
            .then(setReservation)
            .catch(setError)

        return () => abortController.abort()
    }, [])

    useEffect(() => {
        setFirstName(reservation.first_name)
        setLastName(reservation.last_name)
        setMobileNumber(reservation.mobile_number)
        setReservationDate(reservation.reservation_date)
        setReservationTime(reservation.reservation_time)
        setPeople(reservation.people)
    }, [reservation])

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

        const updatedReservation = {
            first_name: first_name,
            last_name: last_name,
            mobile_number: mobile_number,
            reservation_date: reservation_date,
            reservation_time: reservation_time,
            people: people,
            status: reservation.status
        }

        const abortController = new AbortController();

        try {        
            await updateReservation(reservation.reservation_id, updatedReservation, abortController.signal)
            history.push(`/dashboard?date=${updatedReservation.reservation_date}`);
        } catch (error) {
            setError(error.message)
        }

        return () => abortController.abort();
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                <ReservationForm onFirstNameStateChange={handleFirstNameChildStateChange} onLastNameStateChange={handleLastNameChildStateChange} onMobileNumberStateChange={handleMobileNumberChildStateChange} onReservationDateChange={handleReservationDateChildStateChange} onReservationTimeChange={handleReservationTimeChildStateChange} onPeopleChange={handlePeopleChildStateChange} first_name={first_name} last_name={last_name} mobile_number={mobile_number} reservation_date={reservation_date} reservation_time={reservation_time} people={people}/>
                <button type="submit">submit</button>
                <button type="button" onClick={cancelHandler}>Cancel</button>
            </form>
            <ErrorAlert error={error} />
        </div>
    )
}

export default EditReservation