import React, { useState } from "react";

import { updateReservationStatus } from "../utils/api";

function ManageReservation({ reservation_id, first_name, last_name, mobile_number, reservation_date, reservation_time, people }) {
    const [status, setStatus] = useState("Booked")

    async function seatHandler() {
        const newStatus = "Seated";

        await updateReservationStatus(reservation_id, newStatus)
        
        setStatus(newStatus)
    }

    function seatHandler() {
        const newStatus = 'Seated'; // Replace this with your logic to determine the new status
      
        // Use the utility function to update the reservation status
        updateReservationStatus(newStatus)
          .then(response => {
            // Handle the response or update local state if needed
            console.log('Reservation status updated successfully:', response);
            setStatus(newStatus);
          })
          .catch(error => {
            // Handle errors
            console.error('Error updating reservation status:', error.message);
          });
      }

    return (
        <li key={reservation_id}>
            <strong>Name:</strong> {first_name} {last_name}<br />
            <strong>Mobile Number:</strong> {mobile_number}<br />
            <strong>Date:</strong> {reservation_date}<br />
            <strong>Time:</strong> {reservation_time}<br />
            <strong>Party Size:</strong> {people}<br />
            <p data-reservation-id-status={reservation_id}>{status}</p>
            {status === "Booked" && (
                <a href={`/reservations/${reservation_id}/seat`}>
                    <button onClick={seatHandler}>Seat</button>
                </a>
            )}

      </li>
    )
}

export default ManageReservation;