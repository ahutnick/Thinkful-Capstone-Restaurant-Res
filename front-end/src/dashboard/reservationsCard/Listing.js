import React from "react";

function Listing({reservation}) {
    return (
        <tr>
            <td>{reservation.reservation_id}</td>
            <td>{reservation.last_name}</td>
            <td>{reservation.first_name}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.people}</td>
            <td data-reservation-id-status={reservation.reservation_id}>
                {reservation.status}
            </td>
            <td>
                {reservation.status === 'booked' ? <a className="btn btn-info" href={`/reservations/${reservation.reservation_id}/seat`} role="button">Seat</a> : null}
            </td>
        </tr>
    )
}

export default Listing;
