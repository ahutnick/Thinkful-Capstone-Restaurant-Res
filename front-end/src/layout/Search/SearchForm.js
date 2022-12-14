import React, { useState } from "react";
import { listReservations } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function SearchForm({setResults}) {
    const [formData, setFormData] = useState({ mobile_number: "" });
    const [searchErrors, setSearchErrors] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { mobile_number } = formData;
            const abortController = new AbortController();
            const reservations = await listReservations({ mobile_number }, abortController.signal);
            setResults(() => reservations);
            return () => abortController.abort();
        } catch (error) {
            setSearchErrors(error);
        }
    }

    const handleChange = ({target}) => {
        setFormData({ mobile_number: target.value });
    }

    return (
        <>
            <ErrorAlert error={searchErrors} />
            <form onSubmit={handleSubmit}>
                <div className="search-grid">
                    <input 
                        id="mobile_number"
                        name="mobile_number"
                        type="text"
                        placeholder="Enter a customer's phone number"
                        onChange={handleChange}
                        value={formData.value}
                    />
                    <button type="submit" className="btn btn-success">Find</button>
                </div>
            </form>
        </>
    );
}

export default SearchForm;
