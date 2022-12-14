import React from "react";
import ReservationForm from "./ReservationForm";

function NewReservation() {
    return (
        <div className="container container-fluid mt-3">
            <h1 className="display-4">New Reservation</h1>
            <ReservationForm />
        </div>
    );
}

export default NewReservation;
