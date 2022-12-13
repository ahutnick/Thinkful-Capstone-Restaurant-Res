import React from "react";
import { makeAvailable } from "../../utils/api";


function Table({ table, currentDate, setFinishError, setTables, setReservations }) {
    const { table_id, table_name, capacity, available, reservation_id } = table;

    const finishTable = async (event) => {
        event.preventDefault();
        setFinishError(null);
        if (window.confirm(`${table_name}: Is this table ready to seat new guests?`)) {
            try {
                const data = await makeAvailable(table_id, { reservation_id }, currentDate);
                setReservations(data[0]);
                setTables(data[1]);
            } catch(error) {
                setFinishError(error);
            }
        } 
    }

    return (
        <>
            <tr>
                <td>{ table_name }</td>
                <td>{ capacity }</td>
                <td data-table-id-status={table_id} >{ available ? "Free" : "Occupied" }</td>
                <td>{reservation_id ? reservation_id : null}</td>
                <td>{available ? null : <button className="btn btn-danger btn-sm" onClick={finishTable} data-table-id-finish={table.table_id}>Finish</button>}</td>
            </tr>
        </>
    );
}

export default Table;
