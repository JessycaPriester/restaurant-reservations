import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import { createReservation } from "../utils/api";
import Dashboard from "../dashboard/Dashboard";
import ReservationForm from "./ReservationForm";

function CreateReservation() {
    const history = useHistory();

    const [ first_name, setFirstName ] = useState("");
    const [ last_name, setLastName ] = useState("");
    const [ mobile_number, setMobileNumber] = useState("");
    const [ reservation_date, setReservationDate ] = useState("");
    const [ reservation_time, setReservationTime ] = useState("");
    const [ people, setPeople ] = useState(1)
    const [error, setError] = useState(null)

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

        // Check if reservation date is on a day restaurant is closed 
        const dateParts = reservation_date.split('-');
        const reservationDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        

        if (reservationDate.getDay() === 2) {
            setError("The restaurant is closed on Tuesdays.");
            return;
        } 

        // Check if reservation date and time are in the future
        const currentDate = new Date()

        const reservationDateDate = reservationDate.toLocaleDateString('en-US').split('T')[0]
        const currentDateDate = currentDate.toLocaleDateString('en-US').split('T')[0]

        const currentHours = currentDate.getHours().toString().padStart(2, '0');
        const currentMinutes =  currentDate.getMinutes().toString().padStart(2, '0');
        const currentTime = `${currentHours}:${currentMinutes}`;


        if (reservationDateDate === currentDateDate) {
            if (reservation_time < currentTime) {
                setError("Invalid reservation time. Please choose a future time.");
                return;
            }
        }

        const resDate = new Date(reservationDate)


        if (resDate < currentDate) {
            setError("Invalid reservation date. Please choose a future date.");
            return;
        }

        // Check if reservation time is during operating hours
        if (reservation_time < '10:30' || reservation_time > '21:30') {
            setError("Reservation time is outside hours of operation.")
        }

        const abortController = new AbortController();

        try {
            const reservation = await createReservation({first_name, last_name, mobile_number, reservation_date, reservation_time, people}, abortController.signal)
            history.push(`/dashboard?date=${reservation.reservation_date}`)
        } catch (error) {
            console.error("Error handing submit create reservation form: ", error)
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
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
        </div>
    )
}

export default CreateReservation;