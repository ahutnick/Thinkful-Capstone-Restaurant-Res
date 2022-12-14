import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation } from "../utils/api";

function EditReservation() {
    const [reservation, setReservation] = useState(null);
    const [readResErrors, setReadResErrors] = useState(null);
    const { reservation_id } = useParams();

    useEffect(() => {
        const loadRes = async () => {
            try {
                const abortController = new AbortController()
                const data = await readReservation(reservation_id, abortController.signal);
                setReservation(() => data);
                return () => abortController.abort();
            } catch (error) {
                setReadResErrors(error);
            }
        }
        loadRes();
    }, [reservation_id]);

    return (
        <div className="container container-fluid mt-3">
            <ErrorAlert error={readResErrors} />
            <h1 className="display-4">Edit Reservation {reservation ? reservation.reservation_id : null}</h1>
            {reservation ? <ReservationForm reservation={reservation} /> : null}
        </div>
    );
}

export default EditReservation;
