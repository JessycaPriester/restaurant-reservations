import React, { useEffect, useState } from "react";
import { listTables } from "../utils/api";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";

import CreateReservation from "../Reservation/CreateReservation";
import CreateTable from "../Tables/CreateTable";
import SeatReservation from "../Reservation/SeatReservation";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const [tables, setTables] = useState([])
  const [tablesError, setTablesError] = useState(null)

  useEffect(() => {
    const abortController = new AbortController();
    setTablesError(null);

    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError)

  }, [])

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} tables={tables} setTables={setTables}/>
      </Route>
      <Route path="/reservations/new">
        <CreateReservation />
      </Route>
      <Route path="/tables/new">
        <CreateTable setTables={setTables}/>
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservation tables={tables}/>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
