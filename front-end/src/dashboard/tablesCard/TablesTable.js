import React, { useState } from "react";
import Table from "./table";
import ErrorAlert from "../../layout/ErrorAlert";

function TablesTable({ tables, currentDate, setTables, setReservations }) {
    const [finishError, setFinishError] = useState(null);

    return (
        <>
            { finishError?<ErrorAlert error = { finishError } /> : null }

            <table className="table table-striped table-responsive col">
                <thead>
                    <tr>
                        <th>Table Name</th>
                        <th>Capacity</th>
                        <th>Available</th>
                        <th>Res Id</th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {tables.map((table) => <Table key={`table-${table.table_id}`} table={table} currentDate={currentDate} setFinishError={setFinishError} setTables={setTables} setReservations={setReservations} />)}
                </tbody>
            </table>
        </>
    );
}

export default TablesTable;
