import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

function EditReservation() {
    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
    };

    const [reservationError, setReservationError] = useState(null);
    const [formData, setFormData] = useState({ ...initialFormState });
    const [reservation, setReservation] = useState(null)
    const [error, setError] = useState(null);


    const params = useParams();
    const reservation_id = params.reservation_id;
    const history = useHistory();


    // Get the reservation with the matching id from params
    useEffect(() => {
        const abortController = new AbortController();
        setReservationError(null)

        readReservation(reservation_id, abortController.signal)
            .then((reservation) => {
                setFormData({
                    first_name: reservation.first_name,
                    last_name: reservation.last_name,
                    mobile_number: reservation.mobile_number,
                    reservation_date: reservation.reservation_date,
                    reservation_time: reservation.reservation_time,
                    people: reservation.people,
                })
                setReservation(reservation)
            })
            .catch(setReservationError);
        return () => abortController.abort
    }, [reservation_id])


    // INPUT CHANGE HANDLERS

    const textChangeHandler = (event) => {
        setFormData((currentFormData) => ({
            ...currentFormData,
            [event.target.name]: event.target.value,
        }))
    }

    const numberChangeHandler = (event) => {
        setFormData((currentFormData) => ({
            ...currentFormData,
            [event.target.name]: Number(event.target.value),
        }))
    }

    
    // BUTTON HANDLERS

    // Updates the reservation when submitted
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        const abortController = new AbortController();

        const {first_name, last_name, mobile_number, reservation_date, reservation_time, people} = formData
        const updatedReservation = {
            first_name: first_name,
            last_name: last_name,
            mobile_number: mobile_number,
            reservation_date: reservation_date,
            reservation_time: reservation_time,
            people: people,
            status: reservation.status
        }

        try {
            await updateReservation(reservation_id, updatedReservation, abortController.signal)
            history.push(`/dashboard/?date=${updatedReservation.reservation_date}`);
        } catch(error) {
            setError(error);
        }
    };

    return (
        <main>
            <div>
                <h1>Edit Reservation</h1>
            </div>
            <div>
                <ReservationForm formData={formData} textChangeHandler={textChangeHandler} numberChangeHandler={numberChangeHandler} handleSubmit={handleSubmit}/>
            </div>
            <ErrorAlert error={error} />
            <ErrorAlert error={reservationError} />
        </main>
    );
}

export default EditReservation;