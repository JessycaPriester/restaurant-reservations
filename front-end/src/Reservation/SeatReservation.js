import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { listReservations, updateTable } from "../utils/api";

function SeatTable({tables}) {
    const [reservationsError, setReservationsError] = useState(null);
    const [reservation, setReservation] = useState(null);
    const [tableId, setTableId] = useState(null);
    const [table, setTable] = useState({})

    console.log(reservation)

    useEffect(() => {
        const tableMatch = tables.find((table) => Number(table.table_id) === Number(tableId))
        setTable(tableMatch)
    }, [tableId])

    const params = useParams()

    useEffect(() => {
        const abortController = new AbortController();
        setReservationsError(null);
        
        listReservations(abortController.signal)
          .then((data) => {            
            const reservationMatch = data.find((reservation) => {
                return reservation.reservation_id === +params.reservation_id
            })            
            setReservation(reservationMatch)
          })
          .catch(setReservationsError);
    
        return () => abortController.abort();
      }, [params.reservation_id]);


    const handleTableChange = (event) => setTableId(event.target.value)

    const submitHandler = async(event) => {
        event.preventDefault();
        console.log("Submitting")
        updateTable(tableId, {
            ...table,
            reservation_id: reservation.reservation_id,
        })
        .then(console.log("done"))
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                <label htmlFor="table_id">Table Number</label>
                <select name="table_id" onChange={handleTableChange}>
                    <option value="">Select a Table</option>
                    {tables.map((table) => (
                        <option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>
                    ))}
                </select>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default SeatTable;