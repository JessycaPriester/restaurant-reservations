import React from "react";

function SeatTable() {
    const submitHandler = async(event) => {
        event.preventDefault();
        console.log("Submitting")
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                <label htmlFor="table_id">Table</label>
                <select>
                    <option>Test</option>
                </select>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default SeatTable;