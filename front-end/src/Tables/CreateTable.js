import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function CreateTable({setTables}) {
    const history = useHistory();

    const [ table_name, setTableName ] = useState("");
    const [ capacity, setCapacity ] = useState(1);
    const [error, setError] = useState(null)


    // Change handlers for input boxes
    const handleTableNameChange = (event) => setTableName(event.target.value);
    const handleCapacityChange = (event) => setCapacity(Number(event.target.value))

    // Handlers for buttons
    function cancelHandler() {
        history.goBack()
    }

    const submitHandler = async(event) => {
        event.preventDefault();

        const abortController = new AbortController();

        try {
        const table = await createTable({table_name, capacity}, abortController.signal)
        setTables((prevTables) => [...prevTables, table]);
        console.log("Submitted");
        history.push(`/dashboard`)
        } catch (error) {
            setError(error.message)
        }

        return () => abortController.abort()
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                <label htmlFor="table_name">
                    Table Name
                    <input required type="text" id="table_name" name="table_name" onChange={handleTableNameChange} />
                </label>
                <label htmlFor="capacity">
                    Capacity
                    <input required type="number" id="capacity" name="capacity" min="1" onChange={handleCapacityChange}/>
                </label>
                <button type="submit">Submit</button>
                <button type="cancel" onClick={cancelHandler}>Cancel</button>
            </form>
            <ErrorAlert error={error} />
        </div>
    )
}

export default CreateTable;