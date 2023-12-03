import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import { createReservation } from "../utils/api";
import Dashboard from "../dashboard/Dashboard";


function CreateReservation() {
    const history = useHistory();

    const [ first_name, setFirstName ] = useState("");
    const [ last_name, setLastName ] = useState("");
    const [ mobile_number, setMobileNumber] = useState("");
    const [ reservation_date, setReservationDate ] = useState("");
    const [ reservation_time, setReservationTime ] = useState("");
    const [ people, setPartySize ] = useState(1)
    const [error, setError] = useState(null)

    console.log(mobile_number)
    // Change handlers for input boxes
    const handleFirstNameChange = (event) => setFirstName(event.target.value)
    const handleLastNameChange = (event) => setLastName(event.target.value);
    const handleMobileNumberChange = (event) => {
        const number = event.target.value
        const formattedPhoneNumber = number.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        setMobileNumber(formattedPhoneNumber)
    }
    const handleReservationDateChange = (event) => setReservationDate(event.target.value);
    const handleReservationTimeChange= (event) => setReservationTime(event.target.value);
    const handlePartySizeChange = (event) => setPartySize(Number(event.target.value));

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


        const reservation = await createReservation({first_name, last_name, mobile_number, reservation_date, reservation_time, people})
        history.push(`/dashboard?date=${reservation.reservation_date}`)
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
                <label htmlFor="mobile_number">
                    Mobile Number
                    <input required type="text" id="mobile_number" name="mobile_number" onChange={handleMobileNumberChange} />
                </label>
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
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
        </div>
    )
}

export default CreateReservation;