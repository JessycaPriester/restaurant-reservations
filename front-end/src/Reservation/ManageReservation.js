import React, { useState } from "react";

import { updateReservationStatus } from "../utils/api";

function ManageReservation({ reservation_id, first_name, last_name, mobile_number, reservation_date, reservation_time, people, status }) {
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
                    <button>Edit</button>
                </a>
            )}
            <a href={`/reservations/${reservation_id}/edit`}>
                <button>Edit</button>
            </a>
            <button data-reservation-id-cancel={reservation_id}>Cancel</button>
      </li>
    )
}

export default ManageReservation;