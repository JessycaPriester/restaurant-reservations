import React, { useEffect, useState } from "react";
import { listReservations, searchReservation } from "../utils/api"
import ManageReservation from "./ManageReservation";

function SearchReservation() {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [reservations, setReservations] = useState([])

    const phoneNumberChangeHandler = (event) => {
        const number = event.target.value

        const formattedPhoneNumber = number.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        setPhoneNumber(formattedPhoneNumber)
    }

    const submitHandler = async(event) => {
        event.preventDefault()
        
        const abortController = new AbortController();
        const reservationMatch = await searchReservation(phoneNumber, abortController.signal);
        setReservations(reservationMatch)

        return () => abortController.abort()

                console.log(reservations)

    }

    async function handleCancelReservation() {
        const abortController = new AbortController()
        const updatedReservations = await searchReservation(phoneNumber, abortController.signal)
        setReservations(updatedReservations)

        return () => abortController.abort()
    }

    useEffect(() => {
        console.log("Match found")
    }, [reservations])

    return (
        <div>
            <form onSubmit={submitHandler}>
                <label htmlFor="mobile_number">
                    Phone Number:
                    <input required min="10" type="text" id="mobile_number" name="mobile_number" placeholder="Enter a customer's phone number" onChange={phoneNumberChangeHandler}/>
                </label>
                <button type="submit" disabled={phoneNumber.length < 10}>Find</button>
            </form>
            {reservations.length === 0 ? (
                <p>/No reservations found/</p>
            ) : (
                <ul>
                    {reservations.map(({ reservation_id, first_name, last_name, mobile_number, reservation_date, reservation_time, people, status }) => (
                        <ManageReservation handleCancelReservation={handleCancelReservation} reservation_id={reservation_id} first_name={first_name} last_name={last_name} mobile_number={mobile_number} reservation_date={reservation_date} reservation_time={reservation_time} people={people} status={status} />
                    ))}
                </ul>
            )}
        </div>
    )
}

export default SearchReservation