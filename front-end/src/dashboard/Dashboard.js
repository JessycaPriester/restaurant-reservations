import React, { useEffect, useState } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { deleteSeatAssignment, listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

import { previous,today, next } from "../utils/date-time";

import ManageTable from "../Tables/ManageTable";
import ManageReservation from "../Reservation/ManageReservation";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, tables, setTables }) {
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

  useEffect(() => {
    const abortController = new AbortController();
  
    listTables(abortController.signal)
      .then(setTables)
      .catch(console.error);
  
    return () => abortController.abort();
  }, [tables]);

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

  /*async function finishHandler(table_id) {
    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")){
      await deleteSeatAssignment(table_id)

      const table = tables.find((table) => table.table_id === table_id)

      setTables((prevTables) =>
      prevTables.map((t) =>
        t.table_id === table.table_id ? { ...t, reservation_id: null } : t
      )); 
    } 
  }*/

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
          <ManageReservation reservation_id={reservation_id} first_name={first_name} last_name={last_name} mobile_number={mobile_number} reservation_date={reservation_date} reservation_time={reservation_time} people={people} />
        ))}
      </ul>
      <div>
        <button type="button" onClick={previousHandler}>Previous</button>
        <button type="button" onClick={todayHandler}>Today</button>
        <button type="button" onClick={nextHandler}>Next</button>
      </div>
      <h3>Tables</h3>
        <ul>
          {tables.map((table) => (
            <ManageTable key={table.table_id} table={table} setTables={setTables} />
          ))}
        </ul>
    </main>
  );
}

export default Dashboard;



