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
  const [resDate, setResDate] = useState(null);

  const location = useLocation();
  const queryDate = new URLSearchParams(location.search).get('date');
  
  useEffect(() => {
    if (queryDate) {
      setResDate(queryDate);
    } else {
      setResDate(date);
    }
  }, [queryDate, date]);

  useEffect(() => {
    const abortController = new AbortController();
    setReservationsError(null);
    
    listReservations({ date: resDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    return () => abortController.abort();
  }, [resDate]);


  const history = useHistory();


  function previousHandler() {
    history.push(`dashboard?date=${previous(resDate)}`);
  }

  function todayHandler() {
    history.push(`dashboard?date=${today()}`);
  }

  function nextHandler() {
    history.push(`dashboard?date=${next(resDate)}`);
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
