import React, {useEffect, useState} from "react";
import { useHistory, useParams  } from "react-router-dom";

import { listReservations, readReservation, updateReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";


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
    console.log(reservation)

    useEffect(() => {
        const abortController = new AbortController();

        readReservation(reservation_id, abortController.signal)
            .then(setReservation)

        return () => abortController.abort()
    }, [])

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


        //const reservation = await createReservation({first_name, last_name, mobile_number, reservation_date, reservation_time, people})
        //history.push(`/dashboard?date=${reservation.reservation_date}`)

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
        
        await updateReservation(reservation.reservation_id, updatedReservation, abortController.signal)
        history.goBack()

        return () => abortController.abort();
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                <ReservationForm onFirstNameStateChange={handleFirstNameChildStateChange} onLastNameStateChange={handleLastNameChildStateChange} onMobileNumberStateChange={handleMobileNumberChildStateChange} onReservationDateChange={handleReservationDateChildStateChange} onReservationTimeChange={handleReservationTimeChildStateChange} onPeopleChange={handlePeopleChildStateChange} first_name={first_name} last_name={last_name} mobile_number={mobile_number} reservation_date={reservation_date} reservation_time={reservation_time} people={people}/>
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

export default EditReservation