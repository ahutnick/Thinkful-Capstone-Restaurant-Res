import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation, updateReservation } from "../utils/api";

function ReservationForm({ reservation = null }) {
    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 0
    }
    const history = useHistory();

    const [formData, setFormData] = useState(reservation ? reservation : initialFormState);
    const [formError, setFormError] = useState(null);

    const handleChange = ({ target }) => {
        const value = target.id === "people" ? parseInt(target.value) : target.value;

        setFormData({
            ...formData,
            [target.name]: value
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const abortController = new AbortController();
            if (formData.reservation_id) {
                await updateReservation(formData, abortController.signal);
                history.goBack();
            } else {
                const res = await createReservation(formData, abortController.signal);
                history.push(`/dashboard?date=${res.reservation_date.split("T")[0]}`);
            }
            return () => abortController.abort();
        } catch (error) {
            setFormError(error);
        }
    }

    const handleCancel = (event) => {
        event.preventDefault();
        history.goBack();
    }

    return (
        <>

            <ErrorAlert error={formError} />

            <form onSubmit={handleSubmit}>
                <div className="card-body">
                    <div className="form-group form-grid">
                        <label htmlFor="first_name">First Name: </label>
                        <input
                            id="first_name"
                            type="text"
                            name="first_name"
                            required
                            onChange={handleChange}
                            value={formData.first_name}
                        />
                    </div>
                    <div className="form-group form-grid">
                        <label htmlFor="last_name">Last Name: </label>
                        <input
                            id="last_name"
                            type="text"
                            name="last_name"
                            required
                            onChange={handleChange}
                            value={formData.last_name}
                        />
                    </div>
                    <div className="form-group form-grid">
                        <label htmlFor="mobile_number">Mobile Number: </label>
                        <input
                            id="mobile_number"
                            type="tel"
                            name="mobile_number"
                            required
                            onChange={handleChange}
                            value={formData.mobile_number}
                        />
                    </div>
                    <div className="form-group form-grid">
                        <label htmlFor="reservation_date">Date: </label>
                        <input
                            id="reservation_date"
                            type="date"
                            name="reservation_date"
                            placeholder="YYYY-MM-DD"
                            required pattern="/\d{4}-\d{2}-\d{2}/"
                            onChange={handleChange}
                            value={formData.reservation_date}
                        />
                    </div>
                    <div className="form-group form-grid">
                        <label htmlFor="reservation_time">Time: </label>
                        <input
                            id="reservation_time"
                            type="time"
                            name="reservation_time"
                            placeholder="HH:MM"
                            required pattern="/[0-9]{2}:[0-9]{2}/"
                            onChange={handleChange}
                            value={formData.reservation_time}
                        />
                    </div>
                    <div className="form-group form-grid">
                        <label htmlFor="people">People: </label>
                        <input
                            id="people"
                            type="number"
                            name="people"
                            required
                            onChange={handleChange}
                            value={formData.people}
                        />
                    </div>
                </div>
                <div className="card-footer">
                    <div className="button-grid">
                        <button className="btn btn-primary" type="submit">Submit</button>
                        <button className="btn btn-secondary" type="button" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            </form>
        </>

    )

}

export default ReservationForm;
