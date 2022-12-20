import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { listTables, readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import SeatForm from "./SeatForm";

function Seat() {
    const [tables, setTables] = useState([]);
    const [tablesError, setTablesError] = useState(null);
    const [readResError, setReadResError] = useState(null);
    const [reservation, setReservation] = useState(null);
    const { reservation_id } = useParams();

    useEffect(() => {
        const loadRes = async () => {
            try {
                const abortController = new AbortController()
                const data = await readReservation(reservation_id);
                setReservation(() => data);
                return () => abortController.abort();
            } catch(error) {
                setReadResError(error);
            }   
        }
        loadRes();   
    }, [reservation_id]);
    useEffect(loadTables, [reservation]);


    function loadTables() {
        const abortController = new AbortController();
        setTablesError(null);
        if (reservation) {
            listTables({ reservation_date: reservation.reservation_date }, abortController.signal)
                .then(setTables)
                .catch(setTablesError)
        }
        return () => abortController.abort();
    }

    return (
        <div className= "container container-fluid mt-4 col-md-7 col-lg-4">
            <ErrorAlert error={readResError} />
            <ErrorAlert error={tablesError} />
            <div className="card">
                <div className="card-header">
            <h1 className="display-5">Seat </h1>
                </div>

            {reservation ? <SeatForm reservation_id={reservation_id} reservation_date={reservation.reservation_date} tables={tables} />  : null}
            </div>
        </div>
    )
}

export default Seat;
