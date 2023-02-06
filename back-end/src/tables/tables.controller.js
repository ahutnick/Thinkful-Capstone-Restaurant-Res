const services = require("./tables.services");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasOnlyValidProperties = require("../errors/hasOnlyValidProperties");
const getDate = require("../utils/getDate");
const P = require("pino");
const resServices = require("../reservations/reservations.services");

// Variables
const VALID_PROPERTIES = ["table_name", "capacity"];

// Helper Functions
async function listAvailability(req, res, next) {
    const { reservation_date } = req.query;
    const data = await services.listAvailability(reservation_date ? reservation_date : getDate());
    const availability = new Map();
    data.forEach(obj => {
        const { table_id, available, reservation_id } = obj;
        availability.set(table_id, { available, reservation_id });
    });
    return availability;
}

async function seatService(reservation_id, table_id) {
    return await services.seat({ reservation_id, table_id, available: false });
}

// Validations
const hasRequiredProperties = hasProperties(VALID_PROPERTIES);

function isFinished(req, res, next) {
    if (res.locals.reservation.status === "finished") {
        next({ status: 400, message: "Table is already finished" });
    } else {
        next();
    }
}

const isNonzeroNumber = (req, res, next) => {
    const { data: { capacity } } = req.body;
    if (typeof (capacity) !== "number") {
        next({ status: 400, message: "capacity must be a nonzero number" });
    } else if (capacity === 0) {
        next({ status: 400, message: "capacity must not be zero" });
    }
    next();
}

async function isNotOccupied(req, res, next) {
    const { reservation_id } = req.body.data;
    const { table_id } = req.params;
    const data = await services.getAvailable(table_id, reservation_id)
    if (data === undefined || data.available) {
        next({ status: 400, message: "Table is not occupied" });
    }
    next();
}

async function isOccupied(req, res, next) {
    const reservation_date = res.locals.reservation.reservation_date;
    const reservation_time = res.locals.reservation.reservation_time;
    const { table_id } = req.params;
    const data = await services.isOccupied(table_id, reservation_date, reservation_time);
    if (data !== undefined && data.available === false) {
        next({ status: 400, message: "Table is occupied" });
    }
    next();
}

function isSeated(req, res, next) {
    if (res.locals.reservation.status === "seated") {
        next({ status: 400, message: "Table is already seated" });
    } else {
        next();
    }
}

const nameProperLength = (req, res, next) => {
    const { data: { table_name } } = req.body;
    if (table_name.length < 2) {
        next({ status: 400, message: "table_name must be at least two characters" })
    }
    next();
}

async function peopleCapacityCheck(req, res, next) {
    const { reservation_id } = req.body.data;
    const { table_id } = req.params;
    const { people } = await services.getPeople(reservation_id);
    const { capacity } = await services.getCapacity(table_id);
    if (people > capacity) {
        next({ status: 400, message: "Table capacity insufficient for party size" });
    } else {
        next();
    }
}

async function resExists(req, res, next) {
    if (!req.body.data || !req.body.data.reservation_id) {
        next({ status: 400, message: "No reservation_id provided" });
    }
    const { reservation_id } = req.body.data
    const reservation = await resServices.read(reservation_id);
    if (reservation && reservation !== undefined) {
        res.locals.reservation = reservation;
        next()
    } else if (reservation_id) {
        next({ status: 404, message: `Reservation ${reservation_id} not found` });
    }
}

async function tableExists(req, res, next) {
    const { table_id } = req.params
    const table = await services.read(table_id);
    if (table) {
        res.locals.table = table;
        next();
    } else {
        next({ status: 404, message: `Table ${table_id} not found` });
    }
}

// CRUD Functions
async function create(req, res, next) {
    const { table_name, capacity } = req.body.data;
    const data = await services.create({ table_name, capacity })
    if (req.body.data.reservation_id) {
        await seatService(req.body.data.reservation_id, data.table_id);
    }
    res.status(201).json({ data });
}

async function list(req, res, next) {
    const data = await services.list();
    const avail = await listAvailability(req, res, next);
    data.forEach(table => {
        table.available = avail.has(table.table_id) ? avail.get(table.table_id).available : true;
        table.reservation_id = avail.has(table.table_id) ? avail.get(table.table_id).reservation_id : null;
    })
    res.json({ data });
}

async function makeAvailable(req, res, next) {
    const { reservation_id } = req.body.data;
    const { table_id } = req.params;
    const data = await services.makeAvailable(table_id, reservation_id);
    await resServices.updateStatus(reservation_id, "finished");
    res.status(200).json(data);
}

async function read(req, res, next) {
    const data = res.locals.table;
    res.json({ data });
}

async function seat(req, res, next) {
    const reservation_id = req.body.data.reservation_id;
    const table_id = req.params.table_id;
    const data = await services.seat({ reservation_id, table_id, available: false });
    await resServices.updateStatus(reservation_id, "seated");
    res.json({ data })
}

module.exports = {
    create: [hasOnlyValidProperties([...VALID_PROPERTIES, "reservation_id"]), hasRequiredProperties, nameProperLength, isNonzeroNumber, asyncErrorBoundary(create)],
    list: [asyncErrorBoundary(list)],
    seat: [asyncErrorBoundary(tableExists), asyncErrorBoundary(resExists), asyncErrorBoundary(peopleCapacityCheck), isSeated, isFinished, isOccupied, asyncErrorBoundary(seat)],
    read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
    makeAvailable: [asyncErrorBoundary(tableExists), asyncErrorBoundary(resExists), isFinished, asyncErrorBoundary(isNotOccupied), asyncErrorBoundary(makeAvailable)],
}
