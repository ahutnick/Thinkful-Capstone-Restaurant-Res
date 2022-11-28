import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeAvailable } from "../../utils/api";
import {ErrorAlert} from "../../layout/ErrorAlert";

function Table({ table }) {
    const { table_id, table_name, capacity, available, reservation_id } = table;
    const [ finishError, setFinishError ] = useState(null);
    const history = useHistory();

    const finishTable = async (event) => {
        event.preventDefault();
        setFinishError(null);
        if (window.confirm(`Free table ${table_name}?`)) {
            try {
                await makeAvailable(table_id, { reservation_id });
                history.go(0);
            } catch(error) {
                setFinishError(error);
            }
        } 
    }

    return (
        <>
            { finishError ? <tr><ErrorAlert error={finishError} /></tr> : null }
            <tr>
                <td>{ table_name }</td>
                <td>{ capacity }</td>
                <td data-table-id-status={table_id} >{ available ? "Free" : "Occupied" }</td>
                <td>{reservation_id ? reservation_id : null}</td>
                <td><button className="btn btn-danger" onClick={finishTable} data-table-id-finish={table.table_id}>Finish</button></td>
            </tr>
        </>
    );
}

export default Table;
