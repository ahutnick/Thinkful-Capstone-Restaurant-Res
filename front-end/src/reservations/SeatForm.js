import React, { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { seatTable } from "../utils/api"

function SeatForm({ reservation_id, reservation_date, tables }) {
    const initialFormState = { table_id: null };
    const [formData, setFormData] = useState(initialFormState);
    const [formError, setFormError] = useState(null);
    const history = useHistory();

    const handleChange = ({ target }) => {
        setFormData({ table_id: target.value });
    }
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { table_id } = formData;
            await seatTable(table_id, {reservation_id});
            history.push(`/dashboard?date=${reservation_date}`)
        } catch(error) {
            setFormError(error);
        }
    }

    const handleCancel = (event) => {
        event.preventDefault()
        history.goBack();
    }

    return (
        <>
            <ErrorAlert error={formError} />

            <form onSubmit={handleSubmit}>
                <div className="card-body">
                    <div className="form-group form-grid">
                        <label htmlFor="table">Select Table: </label>
                    
                        <select name="table_id" onChange={handleChange} defaultValue={''}>
                            <option value="" disabled>Select a table</option>
                            {tables.map((table) => <option key={`res-with-table-${table.table_id}`} value={table.table_id}>{table.table_name} - {table.capacity}</option>)}
                        </select>
                    </div>
                </div>
                <div className="card-footer">
                    <div className="button-grid">
                        <button className="btn btn-primary" type="submit">Submit</button>
                        <button className="btn btn-secondary ml-3" type="button" onClick={handleCancel}>Cancel</button>
                    </div>  
                </div>
            </form>
        </>
    )
}

export default SeatForm;
