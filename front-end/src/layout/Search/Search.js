import React, { useState } from "react";
import SearchForm from "./SearchForm";
import ReservationTable from "../../dashboard/reservationsCard/ReservationTable";

function Search() {
    const [results, setResults] = useState(null);

    return (
        <div className="container container-fluid mt-3">
            <h1 className="display-4">Search</h1>
            <SearchForm setResults={setResults} /> 
            { results ? (results.length > 0 ? <ReservationTable reservations={results} /> : <h4>No reservations found</h4>) : null }
        </div>
    )
}

export default Search;
