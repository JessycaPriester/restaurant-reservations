import React, { useState } from "react";

function SearchReservation() {
    const [phoneNumber, setPhoneNumber] = useState('')

    const phoneNumberChangeHandler = (event) => {
        const number = event.target.value
        const formattedPhoneNumber = number.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        setPhoneNumber(formattedPhoneNumber)
    }

    const submitHandler = (event) => {
        event.preventDefault()
        console.log("donzo")
    }

    console.log(phoneNumber)

    return (
        <div>
            <form onSubmit={submitHandler}>
                <label htmlFor="mobile_number">
                    Phone Number:
                    <input required min="10" type="text" id="mobile_number" name="mobile_number" placeholder="Enter a customer's phone number" onChange={phoneNumberChangeHandler}/>
                </label>
                <button type="submit">Find</button>
            </form>
        </div>
    )
}

export default SearchReservation