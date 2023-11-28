import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

import { previous,today, next } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, tables }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  //const [tablesError, setTablesError] = useState(null)
  const [resDate, setResDate] = useState(null);
  //const [tables, setTables] = useState([])


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

 /* useEffect(() => {
    const abortController = new AbortController();
    setTablesError(null);

    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError)

  }, []) */


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

  function finishHandler() {
    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")){
      console.log("finished")
 } 
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <h3>Reservations</h3>
      <ul>
        {reservations.map(({ reservation_id, first_name, last_name, mobile_number, reservation_date, reservation_time, people}) => (
          <li key={reservation_id}>
            <strong>Name:</strong> {first_name} {last_name}<br />
            <strong>Mobile Number:</strong> {mobile_number}<br />
            <strong>Date:</strong> {reservation_date}<br />
            <strong>Time:</strong> {reservation_time}<br />
            <strong>Party Size:</strong> {people}<br />
              <button onClick={() => window.location.href = `/reservations/${reservation_id}/seat`}>Seat</button>
          </li>
        ))}
      </ul>
      <div>
        <button type="button" onClick={previousHandler}>Previous</button>
        <button type="button" onClick={todayHandler}>Today</button>
        <button type="button" onClick={nextHandler}>Next</button>
      </div>
      <h3>Tables</h3>
          {tables.map((table) => (
            <li key={table.table_id}>
              <strong>Table Name:</strong> {table.table_name}<br />
              <strong>Table Capacity</strong> {table.capacity}<br />
              {table.reservation_id ? (
                <div>
                  <p data-table-id-status={table.table_id}>Occupied</p>
                  <button onClick={finishHandler} data-table-id-finish={table.table_id}>Finish</button>
                </div>
              ) : (
                <p>Free</p>
              )
            }
            </li>
          ))}
    </main>
  );
}

export default Dashboard;
