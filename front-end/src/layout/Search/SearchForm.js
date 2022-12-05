import React, { useState } from "react";
import { listReservations } from "../../utils/api";

function SearchForm({setResults}) {
    const [formData, setFormData] = useState({ mobile_number: "" });
    const handleSubmit = async (event) => {
        event.preventDefault();
        const { mobile_number } = formData;
        const reservations = await listReservations({mobile_number});
        setResults(() => reservations);
    }

    const handleChange = ({target}) => {
        setFormData({ mobile_number: target.value });
    }

    return (
        <form onSubmit={handleSubmit}>
            <input 
                id="mobile_number"
                name="mobile_number"
                type="text"
                placeholder="Enter a customer's phone number"
                onChange={handleChange}
                value={formData.value}
            />
            <button type="submit" className="btn btn-success">Find</button>
        </form>
    );
}

export default SearchForm;
