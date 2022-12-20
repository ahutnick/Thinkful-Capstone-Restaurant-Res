import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import ReservationTable from "./reservationsCard/ReservationTable";
import ErrorAlert from "../layout/ErrorAlert";
import CurrentDateToggle from "./reservationsCard/CurrentDateToggle";
import TablesTable from "./tablesCard/TablesTable";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [currentDate, setCurrentDate] = useState(getDate());
  const history = useHistory();

  useEffect(loadReservations, [currentDate, history]);
  useEffect(loadTables, [reservations, history, currentDate])

  function getDate() {
    const queryParams = new URLSearchParams(window.location.search);
    const dateTerm = queryParams.get("date");
    return dateTerm ? dateTerm : date;
  }

  function loadReservations() {
    history.push(`/dashboard?date=${currentDate}`);
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({date: currentDate}, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }  

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables({ reservation_date: currentDate }, abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  return (
    <main>
      <div className="col mt-3 mb-5">
        <h1 className="text-center display-3">Dashboard</h1>
      </div>
      <div className="row row-cols-1 row-cols-md-2 mr-2 ml-2 justify-content-center">
        <div className="col col-md-10 col-lg-8 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h4 className="card-title mb-0">Reservations for {currentDate}</h4>
            </div>
            <div className="card-body">
              <ErrorAlert error={reservationsError} />
              <ReservationTable reservations={reservations} setReservations={setReservations} />
            </div>
            <CurrentDateToggle history={history} setCurrentDate={setCurrentDate} currentDate={currentDate} />
          </div>
        </div>
        <div className="col col-md-7 col-lg-4 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h4 className="card-title mb-0">Tables</h4>
            </div>
            <div className="card-body">
              <ErrorAlert error={tablesError} />
              <TablesTable tables={tables} currentDate={currentDate} setTables={setTables} setReservations={setReservations} />
            </div>
          </div>
        </div>
      </div>
      
    </main>
  );
}

export default Dashboard;
