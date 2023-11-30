import React, { useState, useEffect } from 'react';
import { deleteSeatAssignment, listTables } from "../utils/api";
import { useHistory } from 'react-router-dom';


function ManageTable({ table, setTables }) {
    const [status, setStatus] = useState(table.reservation_id ? 'Occupied' : 'Free');

    const history = useHistory()

    const finishHandler = async (table_id) => {
    if (window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
        
        await deleteSeatAssignment(table_id);

        const updatedTables = await listTables();
        setTables(updatedTables);
    }
  };

  useEffect(() => {
    setStatus(table.reservation_id ? 'Occupied' : 'Free');
  }, [table.reservation_id]);

  return (
    <li key={table.table_id}>
      <strong>Table Name:</strong> {table.table_name}<br />
      <strong>Table Capacity</strong> {table.capacity}<br />
      {table.reservation_id ? (
        <div>
          <p data-table-id-status={table.table_id}>{status}</p>
          <button onClick={() => finishHandler(table.table_id)} data-table-id-finish={table.table_id}>
            Finish
          </button>
        </div>
      ) : (
        <p data-table-id-status={table.table_id}>{status}</p>
      )}
    </li>
  );
}

export default ManageTable;
