import React from "react";
import { useHistory } from "react-router-dom";

function ReservationForm({ formData, textChangeHandler, numberChangeHandler, handleSubmit }) {
  const history = useHistory();

  // BUTTON HANDLERS

    function cancelHandler() {
        history.goBack()
    }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="first_name">
            First Name:
          </label>
          <input type="text" id="first_name" name="first_name" onChange={textChangeHandler} value={formData.first_name} required/>
        </div>
        <div>
          <label htmlFor="last_name">
            Last Name:
          </label>
          <input type="text" id="last_name" name="last_name" onChange={textChangeHandler} value={formData.last_name} required/>
        </div>
        <div>
          <label htmlFor="mobile_number">
            Mobile Number:
          </label>
          <input type="tel" id="mobile_number" name="mobile_number" onChange={textChangeHandler} value={formData.mobile_number} required/>
        </div>
        <div>
          <label htmlFor="reservation_date">
            Reservation Date:
          </label>
          <input type="date" id="reservation_date" name="reservation_date" onChange={textChangeHandler} value={formData.reservation_date} required/>
        </div>
        <div>
          <label htmlFor="reservation_time">
            Reservation Time:
          </label>
          <input type="time" id="reservation_time" name="reservation_time" onChange={textChangeHandler} value={formData.reservation_time} required/>
        </div>
        <div>
          <label htmlFor="people">
            Party Size:
          </label>
          <input type="number" id="people" name="people" onChange={numberChangeHandler} value={Number(formData.people)} required/>
        </div>
        <button type="submit">Submit</button>
        <button onClick={cancelHandler}>Cancel</button>
      </form>
    </div>
  );
}

export default ReservationForm;
