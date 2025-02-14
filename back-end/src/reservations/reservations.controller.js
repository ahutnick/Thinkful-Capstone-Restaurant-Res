const services = require("./reservations.services");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasOnlyValidProperties = require("../errors/hasOnlyValidProperties");
const getDate = require("../utils/getDate");
const P = require("pino");

// Variables
const VALID_PROPERTIES = ["first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people"];

// Helper Functions
async function changeStatus(reservation_id, status) {
  const data = await services.updateStatus(reservation_id, status);
  return data[0];
}

// Validations

async function createStatusValidation(req, res, next) {
  const { status } = req.body.data;
  if (!status || status === "booked") {
    next();
  } else {
    next({ status: 400, message: `Reservation status '${status}' is invalid. Status must be 'booked' upon creation` });
  }
}

function dateValidations(req, res, next) {
  const { data: { reservation_date } } = req.body;
  const date = new Date(reservation_date);
  const today = new Date();
  const errors = []
  if (date.getDay() === 1) {
    errors.push("The restaurant is closed on Tuesdays");
  } if (date.getYear() < today.getYear() || (date.getMonth() < today.getMonth() && date.getYear() <= today.getYear()) || (date.getDate() < today.getDate() && date.getMonth() === today.getMonth())) {
    errors.push("Only future reservations are allowed");
  }
  if (errors.length) {
    next({ status: 400, message: errors.length > 1 ? errors.join("; ") : errors[0] })
  }
  next();
}

const hasRequiredProperties = hasProperties(VALID_PROPERTIES);

function isDate(req, res, next) {
  const { data: { reservation_date } } = req.body;
  if (/\d{4}-\d{2}-\d{2}/.test(reservation_date)) {
    next();
  } else {
    next({ status: 400, message: "reservation_date must be of date type with YYYY-MM-DD format" });
  }
}

function isNumber(req, res, next) {
  const { data: { people } } = req.body;
  if (typeof (people) === "number") {
    next();
  } else {
    next({ status: 400, message: "people must be of number type" });
  }
}

function isTime(req, res, next) {
  const { data: { reservation_time } } = req.body;
  if (/\d{2}:\d{2}/.test(reservation_time) || /\d{2}:\d{2}:\d{2}/.test(reservation_time)) {
    next();
  } else {
    next({ status: 400, message: "reservation_time must be of time type with HH:MM or HH:MM:SS format" });
  }
}

async function resExists(req, res, next) {
  const reservation = await services.read(req.params.reservation_id);
  if (reservation !== null && reservation !== undefined) {
    res.locals.reservation = reservation;
    next()
  } else {
    next({ status: 404, message: `Reservation ${req.params.reservation_id} not found` });
  }
}

async function statusValidation(req, res, next) {
  const { status } = req.body.data;
  const message = [];
  if (res.locals.reservation.status === "finished") {
    message.push("Cannot update a reservation with 'finished' status");
  }
  else if (status === "booked" || status === "seated" || status === "finished" || status === "cancelled") {
    next();
  } else {
    message.push("Provided reservation status unknown");
  } if (message.length) {
    next({ status: 400, message: message.join("; ") });
  }
}

function timeValidations(req, res, next) {
  const { data: { reservation_date, reservation_time } } = req.body;
  const time = new Date(`${reservation_date} ${reservation_time}`);
  const now = new Date();
  const errors = [];
  if (time.getHours() < 10 || (time.getHours() === 10 && time.getMinutes() < 30)) {
    errors.push("Choose a time after the restaurant opens at 9:30 AM");
  } else if (time.getHours() > 21 || (time.getHours() === 21 && time.getMinutes() > 30)) {
    errors.push("Reservations stop at 9:30 PM. Choose another time");
  } else if (reservation_date === now.getDate() && (time.getHours() < now.getHours() || (time.getHours() === now.getHours() && time.getMinutes() < now.getMinutes()))) {
    errors.push("Reservations must be at a future time");
  }
  if (errors.length) {
    next({ status: 400, message: errors.length > 1 ? errors.join("; ") : errors[0] })
  }
  next();
}

// CRUD functions

async function create(req, res) {
  const data = await services.create(req.body.data);
  res.status(201).json({ data });
}

async function list(req, res) {
  if (req.query && req.query.mobile_number) {
    const data = await services.search(req.query.mobile_number);
    res.json({ data });

  } else {
    const data = await services.list(req.query.date ? req.query.date : getDate());
    res.json({ data });
  }
}

async function read(req, res) {
  const data = await services.read(req.params.reservation_id);
  res.json({ data });
}

async function update(req, res) {
  const reservation = req.body.data;
  const updated = await services.update(reservation);
  const data = updated[0];
  res.json({ data });
}

async function updateStatus(req, res) {
  const { status } = req.body.data;
  const data = await changeStatus(res.locals.reservation.reservation_id, status);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasOnlyValidProperties([...VALID_PROPERTIES, "status"]), hasRequiredProperties, isDate, isTime, isNumber, dateValidations, timeValidations, asyncErrorBoundary(createStatusValidation), asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(resExists), asyncErrorBoundary(read)],
  update: [asyncErrorBoundary(resExists), hasOnlyValidProperties([...VALID_PROPERTIES, "status", "reservation_id", "created_at", "updated_at"]), hasRequiredProperties, isDate, isTime, isNumber, dateValidations, timeValidations, asyncErrorBoundary(createStatusValidation), asyncErrorBoundary(update)],
  updateStatus: [asyncErrorBoundary(resExists), asyncErrorBoundary(statusValidation), asyncErrorBoundary(updateStatus)],
};
