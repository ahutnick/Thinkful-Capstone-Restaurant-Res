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
        <>
            <h1>Edit Reservation {reservation ? reservation.reservation_id : null}</h1>
            {reservation ? <ReservationForm reservation={reservation} /> : null}
        </>
    );
}

export default EditReservation;
