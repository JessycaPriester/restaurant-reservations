import React, { useState } from "react";

import { updateReservationStatus } from "../utils/api";

function ManageReservation({ handleCancelReservation, reservation_id, first_name, last_name, mobile_number, reservation_date, reservation_time, people, status }) {
    function cancelHandler() {
        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            const newStatus = "cancelled"
            updateReservationStatus(reservation_id, newStatus)

            handleCancelReservation()
        }
    }

    return (
        <li key={reservation_id}>
            <strong>Name:</strong> {first_name} {last_name}<br />
            <strong>Mobile Number:</strong> {mobile_number}<br />
            <strong>Date:</strong> {reservation_date}<br />
            <strong>Time:</strong> {reservation_time}<br />
            <strong>Party Size:</strong> {people}<br />
            <p data-reservation-id-status={reservation_id}>{status}</p>
            {status === "booked" && (
                <a href={`/reservations/${reservation_id}/seat`}>
                    <button>Seat</button>
                </a>
            )}
            <a href={`/reservations/${reservation_id}/edit`}>
                <button>Edit</button>
            </a>
            <button data-reservation-id-cancel={reservation_id} onClick={cancelHandler}>Cancel</button>
      </li>
    )
}

export default ManageReservation;