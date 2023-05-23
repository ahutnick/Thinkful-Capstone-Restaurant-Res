import React from "react";
import { cancelReservation } from "../../utils/api";

function Listing({reservation, setReservations, path, setCancelError}) {
    const cancel = async (event) => {
        event.preventDefault();
        try {
            if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
                const data = await cancelReservation(reservation.reservation_id, reservation.reservation_date);
                setReservations(data);
            }
        } catch (error) {
            setCancelError(error);
        }
    }

    const time = (reservation.reservation_time).slice(0, -3);

    return reservation.status !== "cancelled" ? (
        <tr>
            <td>{reservation.reservation_id}</td>
            {path.includes("search") ? <td>{reservation.reservation_date}</td> : null}
            <td>{reservation.last_name}</td>
            <td className="sm-collapse mid-collapse">{reservation.first_name}</td>
            <td>{reservation.mobile_number}</td>
            <td>{time}</td>
            <td>{reservation.people}</td>
            <td data-reservation-id-status={reservation.reservation_id} className="sm-collapse mid-collapse">
                {reservation.status}
            </td>
            <td>
                {reservation.status === 'booked' ? <a className="btn btn-warning btn-sm" href={`/reservations/${reservation.reservation_id}/edit`} role="button">Edit</a> : null}
            </td>
            <td>
                {reservation.status === 'booked' ? <a className="btn btn-info btn-sm" href={`/reservations/${reservation.reservation_id}/seat`} role="button">Seat</a> : null}
            </td>
            <td>
                {(reservation.status === 'booked' ? <button className="btn btn-secondary btn-sm" data-reservation-id-cancel={reservation.reservation_id} onClick={cancel}>Cancel</button> : null)}
            </td>
        </tr>
    ) : null
}

export default Listing;
