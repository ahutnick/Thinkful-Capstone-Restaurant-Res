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
        <div className="container container-fluid mt-4 col-md-7 col-lg-4">
            <ErrorAlert error={readResErrors} />
            <div className="card">
                <div className="card-header">
                    <h1 className="display-5">Edit Reservation {reservation ? reservation.reservation_id : null}</h1>
                </div>
                {reservation ? <ReservationForm reservation={reservation} /> : null}
            </div>
        </div>
    );
}

export default EditReservation;
