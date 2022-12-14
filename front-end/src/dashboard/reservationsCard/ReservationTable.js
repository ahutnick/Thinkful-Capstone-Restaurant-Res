import React, { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import ErrorAlert from "../../layout/ErrorAlert";
import Listing from "./Listing";

function ReservationTable({reservations, setReservations}) {
    const { path } = useRouteMatch();
    const [cancelError, setCancelError] = useState(null);

    return (
        <>
            <ErrorAlert error={cancelError} />
            <table className="table table-striped table-responsive col text-center">
                <thead>
                    <tr>
                        <th>Id</th>
                        {path.includes("search") ? <th>Date</th> : null}
                        <th>Last Name</th>
                        <th>First Name</th>
                        <th>Mobile Number</th>
                        <th>Time</th>
                        <th>Party</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map(reservation => <Listing key={`reservation-${reservation.reservation_id}`} reservation={reservation} setReservations={setReservations} path={path} setCancelError={setCancelError} />)}
                </tbody>
            </table>
        </>
    );
}

export default ReservationTable;
