import React from "react";
import TableForm from "./TableForm";

function NewTable() {
    return (
        <div className="container container-fluid mt-4 col-md-7 col-lg-4">
            <div className="card">
                <div className="card-header">
                    <h1 className="display-5">New Table</h1>
                </div>
                <TableForm />
            </div>
        </div>
    );
}

export default NewTable;
