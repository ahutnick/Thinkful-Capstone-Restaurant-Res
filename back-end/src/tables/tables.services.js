const knex = require("../db/connection");

function create(table) {
    return knex("tables")
        .insert(table)
        .returning("*")
        .then(createdRecords => createdRecords[0]);
}

function getAvailable(table_id, reservation_id = null) {
    if (reservation_id) {
        return knex("res_tables as rt")
            .select("rt.available")
            .where("rt.table_id", table_id)
            .andWhere("rt.reservation_id", reservation_id)
            .first()
    } else {
        return knex("res_tables as rt")
            .select("rt.available")
            .where("rt.table_id", table_id)
            .first()
            .then((result) => {
                return result ? result : { available: true };
            })
    }
}

function getCapacity(table_id) {
    return knex("tables as t")
        .select("t.capacity")
        .where("t.table_id", table_id)
        .first()
}

function getPeople(reservation_id, table_id) {
    return knex("reservations as r")
        .select("r.people")
        .where("r.reservation_id", reservation_id)
        .first()
}

function list() {
    return knex("tables as t")
        .select("t.*")
        .orderBy("t.table_name");
}

function listAvailability(reservation_date) {
    return knex("tables")
        .join("res_tables", "tables.table_id", "res_tables.table_id")
        .join("reservations", "res_tables.reservation_id", "reservations.reservation_id")
        .select("tables.table_id", "reservations.reservation_id", "res_tables.available")
        .where("reservations.reservation_date", reservation_date)
        .andWhere({ "res_tables.available": false })
        .orderBy("reservations.reservation_time");
}

function read(tableId) {
    return knex("tables as t").select("*").where({ table_id: tableId }).first();
}

function seat(res_table) {
    return knex("res_tables as rt")
        .insert(res_table)
        .returning("*")
        .then(createdRecords => createdRecords[0]);
}

function isOccupied(table_id, reservation_date, reservation_time) {
    // Find minimum and maximum times to ensure tables can be seated in 2 hour intervals
    const date = `${reservation_date.getFullYear()}-${reservation_date.getMonth() + 1}-${reservation_date.getDate()}`
    const res_time = new Date(`${date} ${reservation_time}`);
    res_time.setMinutes(res_time.getMinutes() - 119);
    const min_time = `${res_time.getHours()}:${res_time.getMinutes()}:00`;
    res_time.setMinutes(res_time.getMinutes() + 238);
    const max_time = `${res_time.getHours()}:${res_time.getMinutes()}:00`;

    return knex("res_tables")
        .join("reservations", "res_tables.reservation_id", "reservations.reservation_id")
        .select("res_tables.available")
        .where("res_tables.table_id", table_id)
        .andWhere({ "res_tables.available": false })
        .andWhere({ "reservations.reservation_date": reservation_date })
        .whereBetween("reservations.reservation_time", [min_time, max_time])
        .first()
}

function makeAvailable(table_id, reservation_id = null) {
    if (reservation_id) {
        return knex("res_tables")
            .where({ table_id: table_id })
            .andWhere({ reservation_id: reservation_id })
            .update({ available: true })
            .returning("*")
    } else {
        return knex("res_tables")
            .where({ table_id: table_id })
            .update({ available: true })
            .returning("*")
    }
}

module.exports = {
    create,
    list,
    listAvailability,
    read,
    seat,
    getPeople,
    getCapacity,
    getAvailable,
    makeAvailable,
    isOccupied,
}
