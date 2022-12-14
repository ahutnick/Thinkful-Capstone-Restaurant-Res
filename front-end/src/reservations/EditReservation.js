import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import { readReservation } from "../utils/api";

function EditReservation() {
    const [reservation, setReservation] = useState(null);
    const { reservation_id } = useParams();

    useEffect(() => {
        const loadRes = async () => {
            const data = await readReservation(reservation_id);
            setReservation(() => data);
        }

        loadRes();
    }, [reservation_id]);

    return (
        <div className="container container-fluid mt-3">
            <h1 className="display-4">Edit Reservation {reservation ? reservation.reservation_id : null}</h1>
            {reservation ? <ReservationForm reservation={reservation} /> : null}
        </div>
    );
}

export default EditReservation;
