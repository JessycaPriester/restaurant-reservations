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
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [resDate, setResDate] = useState(null);
  const [tables, setTables] = useState([])
  const [tablesError, setTablesError] = useState(null)

  const location = useLocation();

  const queryDate = new URLSearchParams(location.search).get('date');

  // Display the Reservations and the tables

  // Every time the date in the query changes or the date/today passed down from Routes.js passes, set the resDate to the new date
  useEffect(() => {
    if (queryDate) {
      setResDate(queryDate);
    } else {
      setResDate(date);
    }
  }, [queryDate, date]);


  // Every time the resDate changes get the reservations for this date and then set reservations to these reservations
  useEffect(() => {
    const abortController = new AbortController();
    setReservationsError(null);
    
    if(resDate) {
      listReservations({ date: resDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    }

    return () => abortController.abort();
  }, [resDate]);



  // When the page is first rendered get the tables and set the tables state to these tables
  useEffect(() => {
    const abortController = new AbortController();
    setTablesError(null);

    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError)

    return () => abortController.abort()
  }, [])



  // Handlers for buttons

  const history = useHistory();

  // When the previous button is pressed go to the previous dates page
  function previousHandler() {
    history.push(`dashboard?date=${previous(resDate)}`);
  }

  // When the today button is pressed go to todays dates page
  function todayHandler() {
    history.push(`dashboard?date=${today()}`);
  }

  // When the next button is pressed go to the next dates page
  function nextHandler() {
    history.push(`dashboard?date=${next(resDate)}`);
  }

  // When the finish button is pressed set tables to the updated tables and set reservations to the updated reservations
  async function handleFinishTable(table_id) {
    const abortController = new AbortController();
    console.log(resDate)

    try {
      const updatedReservations = await listReservations({date: resDate}, abortController.signal)
      console.log(updatedReservations)
      setReservations(updatedReservations)  

      const updatedTables = await listTables(abortController.signal)
      setTables(updatedTables)
    } catch (error) {
      console.error("Error handling finished table: ", error)
    }

    return () => abortController.abort()
  }

  async function handleCancelReservation() {
    const abortController = new AbortController();

    try {
      const updatedReservations = await listReservations({date: resDate}, abortController.signal)
      console.log(updatedReservations)
      setReservations(updatedReservations)
    } catch (error) {
      console.error("Error handling cancel reservation: ", error)
    }

    return () => abortController.abort()
  }

  // If tables ever changes, rerender the page
  useEffect(() => {
    console.log("Tables and/or reservations have been updated")
  }, [tables, reservations]);

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <h3>Reservations</h3>
      <div>
        <button type="button" onClick={previousHandler}>Previous</button>
        <button type="button" onClick={todayHandler}>Today</button>
        <button type="button" onClick={nextHandler}>Next</button>
      </div>
      <ul style={{ listStyle: "none"}}>
        {reservations.map(({ reservation_id, first_name, last_name, mobile_number, reservation_date, reservation_time, people, status}) => (
          <ManageReservation handleCancelReservation={handleCancelReservation} reservation_id={reservation_id} first_name={first_name} last_name={last_name} mobile_number={mobile_number} reservation_date={reservation_date} reservation_time={reservation_time} people={people} status={status}/>
        ))}
      </ul>

      <h3>Tables</h3>
        <ul style={{listStyle: "none"}}>
          {tables.map((table) => (
            <ManageTable table={table} handleFinishTable={handleFinishTable} />
          ))}
        </ul>
    </main>
  );
}

export default Dashboard;