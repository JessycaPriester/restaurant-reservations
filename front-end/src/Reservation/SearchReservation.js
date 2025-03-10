import React, { useEffect, useState } from "react";
import { searchReservation } from "../utils/api"
import ManageReservation from "./ManageReservation";
import ErrorAlert from "../layout/ErrorAlert";

function SearchReservation() {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [reservations, setReservations] = useState([])
    const [reservationError, setReservationError] = useState(null)
    const [error, setError] = useState(null)


    // INPUT CHANGE HANDLERS

    const phoneNumberChangeHandler = (event) => {
        const number = event.target.value

        const formattedPhoneNumber = number.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        setPhoneNumber(formattedPhoneNumber)
    }


    // BUTTON HANDLERS

    // Gets all the reservations with the matching phone number
    const submitHandler = async(event) => {
        event.preventDefault()
        
        const abortController = new AbortController();
        setReservationError(null)

        try {
            const reservationMatch = await searchReservation(phoneNumber, abortController.signal);
            setReservations(reservationMatch)
        } catch (error) {
            setReservationError(error)
        }

        return () => abortController.abort()
    }

    // Sets the status of the reservation to cancelled
    async function handleCancelReservation() {
        const abortController = new AbortController()

        try {
        const updatedReservations = await searchReservation(phoneNumber, abortController.signal)
        setReservations(updatedReservations)
        } catch (error) {
            setError(error.message)
        }

        return () => abortController.abort()
    }

    return (
        <div>
            <h1>Search Reservations</h1>
            <form onSubmit={submitHandler}>
                <label htmlFor="mobile_number">
                    Phone Number:
                    <input required min="10" type="text" id="mobile_number" name="mobile_number" placeholder="Enter a customer's phone number" onChange={phoneNumberChangeHandler}/>
                </label>
                <button type="submit" disabled={phoneNumber.length < 10}>Find</button>
            </form>
            <ErrorAlert error={reservationError} />
            <ErrorAlert error={error} />
            {reservations.length === 0 ? (
                <p>/No reservations found/</p>
            ) : (
                <div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Phone</th>
                                <th scope="col">Reservation Date</th>
                                <th scope="col">Reservation Time</th>
                                <th scope="col">Party</th>
                                <th scope="col">Status</th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map(({ reservation_id, first_name, last_name, mobile_number, reservation_date, reservation_time, people, status }) => (
                                <ManageReservation key={reservation_id} handleCancelReservation={handleCancelReservation} reservation_id={reservation_id} first_name={first_name} last_name={last_name} mobile_number={mobile_number} reservation_date={reservation_date} reservation_time={reservation_time} people={people} status={status} />
                            ))}
                        </tbody>
                    </table>
                    <ErrorAlert error={reservationError} />
                    <ErrorAlert error={error} />
                </div>
            )}
        </div>
    )
}

export default SearchReservation