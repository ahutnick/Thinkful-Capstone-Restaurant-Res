import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";


function TableForm() {
    const initialFormState = {
        table_name: "",
        capacity: 0,
    };
    const history = useHistory();

    const [formData, setFormData] = useState(initialFormState);
    const [formError, setFormError] = useState(null);
    
    const handleChange = ({ target }) => {
        const value = target.id === "capacity" ? parseInt(target.value) : target.value;

        setFormData({
            ...formData,
           [target.name]: value
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await createTable(formData);
            history.push('/dashboard');
        } catch(error) {
            setFormError(error);
        }
    }

    const handleCancel = (event) => {
        event.preventDefault();
        history.goBack();
    }

    return (
        <>
            <ErrorAlert error={formError} />

            <form onSubmit={ handleSubmit }>
                <div className="form-group form-grid">
                <label htmlFor="table_name">Table Name: </label>
                    <input 
                        id="table_name"
                        type="text"
                        name="table_name"
                        required
                        onChange={handleChange}
                        value={formData.table_name}
                    />
                </div>
                <div className="form-group form-grid">
                    <label htmlFor="capacity">Capacity: </label>
                    <input 
                        id="capacity"
                        type="number"
                        name="capacity"
                        required
                        onChange={handleChange}
                        value={formData.capacity}
                    />
                </div>
                <div className="button-grid">
                    <button className="btn btn-primary" type="submit">Submit</button>
                    <button className="btn btn-secondary" type="button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
            
        </>
    );
}

export default TableForm;
