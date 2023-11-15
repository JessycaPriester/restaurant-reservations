import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

import { previous,today, next } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  //const [resDate, setResDate] = useState({ date })

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const history = useHistory();

  const location = useLocation();
  const test = new URLSearchParams(location.search).get('date');
  console.log(test)

  //useEffect(() => {
    //history.push(`/dashboard?date=${resDate}`);
  //}, [resDate, history]);

  function previousHandler() {
    //setResDate(previous(resDate));
    console.log("prev")
  }

  function todayHandler() {
    //setResDate(today());
    console.log("today")
  }

  function nextHandler() {
    //setResDate(next(resDate));
    console.log("next")
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}
      <div>
        <button type="button" onClick={previousHandler}>Previous</button>
        <button type="button" onClick={todayHandler}>Today</button>
        <button type="button" onClick={nextHandler}>Next</button>
      </div>
    </main>
  );
}

export default Dashboard;
