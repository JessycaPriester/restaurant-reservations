import React, {useState} from "react";
import { useHistory } from "react-router-dom";
//import { createTable } from "../utils/api";

function CreateTable() {
    const history = useHistory();

    const [ table_name, setTableName ] = useState("");
    const [ capacity, setCapacity ] = useState(1);


    // Change handlers for input boxes
    const handleTableNameChange = (event) => setTableName(event.target.value);
    const handleCapacityChange = (event) => setCapacity(Number(event.target.value))

    // Handlers for buttons
    function cancelHandler() {
        history.goBack()
    }

    const submitHandler = async(event) => {
        event.preventDefault();
        //const table = await createTable({table_name, capacity})
        console.log("Submitted");
        history.push(`/dashboard`)
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
                    <input required type="number" id="capacity" min="1" onChange={handleCapacityChange}/>
                </label>
                <button type="submit">Submit</button>
                <button type="cancel" onClick={cancelHandler}>Cancel</button>
            </form>
        </div>
    )
}

export default CreateTable;