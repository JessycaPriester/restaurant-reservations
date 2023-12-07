import React, { useState } from "react";
import ReservationForm from "./ReservationForm";
import { createReservation } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function CreateReservation() {
    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
    }

    const [formData, setFormData] = useState({ ...initialFormState });
    const [error, setError] = useState(false);

 
    const history = useHistory();
  // Handlers 

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null)
    const abortController = new AbortController();

    const {first_name, last_name, mobile_number, reservation_date, reservation_time, people} = formData

    try {
      const response = await createReservation({first_name, last_name, mobile_number, reservation_date, reservation_time, people}, abortController.signal);
      history.push(`/dashboard/?date=${response.reservation_date}`);
    } catch(error) {
      setError(error);
    }
  }

  return (
    <div>
        <h1>New Reservation</h1>
        <ReservationForm
          formData={formData}
          textChangeHandler={textChangeHandler}
          numberChangeHandler={numberChangeHandler}
          handleSubmit={handleSubmit}
        />
        <ErrorAlert error={error} />
    </div>
  );
}

export default CreateReservation;
