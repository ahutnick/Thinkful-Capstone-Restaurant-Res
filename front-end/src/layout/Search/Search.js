import React, { useState } from "react";
import SearchForm from "./SearchForm";
import ReservationTable from "../../dashboard/reservationsCard/ReservationTable";

function Search() {
    const [results, setResults] = useState(null);

    return (
        <>
            <h3>Search</h3>
            <SearchForm setResults={setResults} />
            { results ? (results.length > 0 ? <ReservationTable reservations={results} /> : <h4>No reservations found</h4>) : null }
        </>
    )
}

export default Search;
