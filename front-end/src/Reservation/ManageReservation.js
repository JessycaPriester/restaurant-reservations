import React, { useState } from "react";

import { updateReservationStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function ManageReservation({ handleCancelReservation, reservation_id, first_name, last_name, mobile_number, reservation_date, reservation_time, people, status }) {
    const [error, setError] = useState(null)

    // BUTTON HANDLERS

    async function cancelHandler() {
        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            const newStatus = "cancelled"
            const abortController = new AbortController();

            try {
                await updateReservationStatus(reservation_id, newStatus, abortController.signal)

                handleCancelReservation()
            } catch (error) {
                setError(error)
            }

            return () => abortController.abort();
        }
    }

    
    if (error) {
        return (
            <ErrorAlert error={error} />
        )
    }

    if (status !== "cancelled") {
        return (
            <tr key={reservation_id}>
                <td>{first_name} {last_name}</td>
                <td>{mobile_number}</td>
                <td>{reservation_date}</td>
                <td>{reservation_time}</td>
                <td>{people}</td>
                <td data-reservation-id-status={reservation_id}>{status}</td>
                <td>
                    {status === "booked" && (
                        <a href={`/reservations/${reservation_id}/seat`}>
                             <button>Seat</button>
                        </a>
                    )}
                    <a href={`/reservations/${reservation_id}/edit`}>
                        <button>Edit</button>
                    </a>
                    <button data-reservation-id-cancel={reservation_id} onClick={cancelHandler}>Cancel</button>
                </td>
            </tr>
        )
    } else {
        return (
            <tr key={reservation_id}>
                <td>{first_name} {last_name}</td>
                <td>{mobile_number}</td>
                <td>{reservation_date}</td>
                <td>{reservation_time}</td>
                <td>{people}</td>
                <td data-reservation-id-status={reservation_id}>{status}</td>
                <td></td>
            </tr>
        )
    }
}

export default ManageReservation;
