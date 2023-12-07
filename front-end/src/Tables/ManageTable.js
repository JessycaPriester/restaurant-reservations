import React, { useState, useEffect } from 'react';
import { deleteSeatAssignment } from "../utils/api";
import ErrorAlert from '../layout/ErrorAlert';

function ManageTable({ table, handleFinishTable }) {
    const [status, setStatus] = useState(table.reservation_id ? 'occupied' : 'free');
    const [error, setError] = useState(null)


  const finishHandler = async (table_id) => {
    const abortController = new AbortController()

    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
      // Updates the reservation status to finished and removes the table assignment

      try {
        await deleteSeatAssignment(table_id, abortController.signal)

        // Rerenders the page
        handleFinishTable(table_id)
      } catch (error) {
        setError(error.message)
      }
    }
    return() => abortController.abort()
  }

  useEffect(() => {
    setStatus(table.reservation_id ? 'Occupied' : 'Free');
  }, [table.reservation_id]);

  if(error) {
    return (
      <ErrorAlert error = {error} />
    )
  }

  if (status === "occupied" || table.reservation_id) {
    return(
        <tr key={table.table_id}>
          <td>{table.table_name}</td>
          <td>{table.capacity}</td>
          <td data-table-id-status={table.table_id}>{status}</td>
          <td>
            <button onClick={() => finishHandler(table.table_id, table.reservation_id)} data-table-id-finish={table.table_id}>
              Finish
            </button>
            </td>
        </tr>
    )
  } else {
    return(
        <tr key={table.table_id}>
          <td>{table.table_name}</td>
          <td>{table.capacity}</td>
          <td data-table-id-status={table.table_id}>{status}</td>
          <td></td>
        </tr>
    )
  }
  
}

export default ManageTable;
