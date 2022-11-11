const services = require("./tables.services");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasOnlyValidProperties = require("../errors/hasOnlyValidProperties");
const P = require("pino");
const  resServices = require("../reservations/reservations.services")


const VALID_PROPERTIES = ["table_name", "capacity"];

const hasRequiredProperties = hasProperties(VALID_PROPERTIES);

const isNonzeroNumber = (req, res, next) => {
    const { data: { capacity } } = req.body;
    if (typeof(capacity) !== "number") {
        next({ status: 400, message: "capacity must be a nonzero number" });
    } else if (capacity === 0) {
        next({ status: 400, message: "capacity must not be zero" });
    }
    next();
}

const nameProperLength = (req, res, next) => {
    const { data: { table_name } } = req.body;
    if (table_name.length < 2) {
        next({ status: 400, message: "table_name must be at least two characters" })
    }
    next();
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

async function resExists(req, res, next) {
    if (!req.body.data || !req.body.data.reservation_id) {
        next({ status: 400, message: "No reservation_id provided" });
    }
    const { reservation_id } = req.body.data
    const reservation = await resServices.read(reservation_id);
    if (reservation) {
        next()
    } else if (reservation_id) {
        next({ status: 404, message: `Reservation ${reservation_id} not found` });
    }
}

async function resTableValidations(req, res, next) {
    const errors = [];
    const { reservation_id } = req.body.data;
    const { table_id } = req.params;
    const { people } = await services.getPeople(reservation_id);
    const { capacity } = await services.getCapacity(table_id);
    const available = await services.getAvailable(table_id);
    if (people > capacity) {
        errors.push("Table capacity insufficient for party size");
    } 
    if (available && !available.available) {
        errors.push("Table is occupied");
    }
    if (errors.length) {
        next({ status: 400, message: errors.length > 1 ? errors.join("; ") : errors[0] });
    }
    next();
}

function getDate() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
}

async function create(req, res, next) {
    const data = await services.create(req.body.data)
    res.status(201).json({ data });
}

async function list(req, res, next) {
    const data = await services.list()
    res.json({ data });
}

async function seat(req, res, next) {
    const reservation_id = req.body.data.reservation_id;
    const table_id = req.params.table_id;
    const data = await services.seat({ reservation_id, table_id, available: false })
    res.json({ data })
}

module.exports = {
    create: [hasOnlyValidProperties(VALID_PROPERTIES), hasRequiredProperties, nameProperLength, isNonzeroNumber, asyncErrorBoundary(create)],
    list: [asyncErrorBoundary(list)],
    seat: [asyncErrorBoundary(tableExists), asyncErrorBoundary(resExists), asyncErrorBoundary(resTableValidations), asyncErrorBoundary(seat)]
}
