import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";

function CreateTable() {
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

        // Check if table name exists
        if (!table_name) {
            setError("Table name is required.");
            return;
        }

        // Check if table name is two or more characters long
        if (table_name.length < 2) {
            setError("Table name must be at least two characters long.")
            return;
        }

        // Check that capacity is one or more
        if (Number(capacity) < 1) {
            setError("Capacity must be at least 1");
            return;
        }

        const table = await createTable({table_name, capacity})
        console.log("Submitted");
        history.push(`/dashboard`)
        window.location.reload()
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
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
        </div>
    )
}

export default CreateTable;