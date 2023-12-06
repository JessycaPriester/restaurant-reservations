import React, { useState, useEffect } from 'react';
import { deleteSeatAssignment, listTables, updateReservationStatus } from "../utils/api";
import { useHistory } from 'react-router-dom';


function ManageTable({ table, handleFinishTable }) {
    const [status, setStatus] = useState(table.reservation_id ? 'occupied' : 'free');

    const history = useHistory()

  const finishHandler = async (table_id, reservation_id) => {
    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
      const updatedStatus = "finished"
      // Updates the reservation status to finished and removes the table assignment
      await deleteSeatAssignment(table_id)

      // Rerenders the page
      handleFinishTable(table_id)
    }
  }

  useEffect(() => {
    setStatus(table.reservation_id ? 'Occupied' : 'Free');
  }, [table.reservation_id]);

  return (
    <li key={table.table_id}>
      <strong>Table Name:</strong> {table.table_name}<br />
      <strong>Table Capacity</strong> {table.capacity}<br />
      {status === "free" ? (
        <div>
          <p data-table-id-status={table.table_id}>{status}</p>
        </div>
      ) : (
        <div>
          <p data-table-id-status={table.table_id}>{status}</p>
          <button onClick={() => finishHandler(table.table_id, table.reservation_id)} data-table-id-finish={table.table_id}>
          Finish
        </button>
      </div>
      )}
    </li>
  );
}

export default ManageTable;
