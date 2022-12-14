import React from "react";
import { useRouteMatch } from "react-router-dom";
import Listing from "./Listing";

function ReservationTable({reservations, setReservations}) {
    const { path } = useRouteMatch();

    return (
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
                {reservations.map(reservation => <Listing key={`reservation-${reservation.reservation_id}`} reservation={reservation} setReservations={setReservations} path={path} />)}
            </tbody>
        </table>
    );
}

export default ReservationTable;
