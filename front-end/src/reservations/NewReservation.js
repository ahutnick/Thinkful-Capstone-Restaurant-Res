import React from "react";
import ReservationForm from "./ReservationForm";

function NewReservation() {
    return (
        <div className="container container-fluid mt-4 col-md-7 col-lg-4">
            <div className="card">
                <div className="card-header">
                    <h1 className="display-5">New Reservation</h1>
                </div>
                <ReservationForm />
            </div>
        </div>
    );
}

export default NewReservation;
