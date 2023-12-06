import React, { useState } from "react";

function ReservationForm({onFirstNameStateChange, onLastNameStateChange, onMobileNumberStateChange, onReservationDateChange, onReservationTimeChange, onPeopleChange, first_name, last_name, mobile_number, reservation_date, reservation_time, people}) {
    const [childStateFirstName, setChildStateFirstName] = useState("")
    const [childStateLastName, setChildStateLastName] = useState("")
    const [childStateMobileNumber, setChildStateMobileNumber] = useState("")
    const [childStateReservationDate, setChildStateReservationDate] = useState("")
    const [childStateReservationTime, setChildStateReservationTime] = useState("")
    const [childStatePeople, setChildStatePeople] = useState(1)

    const handleFirstNameChange = (event) => {
        const newValue = event.target.value
        setChildStateFirstName(newValue)
        onFirstNameStateChange(newValue)
    }

    const handleLastNameChange = (event) => {
        const newValue = event.target.value
        setChildStateLastName(newValue);
        onLastNameStateChange(newValue)
    }

    const handleMobileNumberChange = (event) => {
        const number = event.target.value
        const formattedPhoneNumber = number.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        setChildStateMobileNumber(formattedPhoneNumber)
        onMobileNumberStateChange(formattedPhoneNumber)
    }

    const handleReservationDateChange = (event) => {
        const newValue = event.target.value
        setChildStateReservationDate(newValue);
        onReservationDateChange(newValue)
    }

    const handleReservationTimeChange= (event) => {
        const newValue = event.target.value
        setChildStateReservationTime(newValue);
        onReservationTimeChange(newValue)
    }

    const handlePartySizeChange = (event) => {
        const newValue = event.target.value
        setChildStatePeople(Number(newValue));
        onPeopleChange(newValue)
    }
    

    return (
        <>
            <label htmlFor="first_name">
                    First Name
                    <input required type="text" id="first_name" name="first_name" value={first_name} onChange={handleFirstNameChange} />
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
        </>
    )
}

export default ReservationForm