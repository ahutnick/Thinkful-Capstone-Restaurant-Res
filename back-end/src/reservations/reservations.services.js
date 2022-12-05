const knex = require("../db/connection");

function create(reservation) {
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
}

function list(date) {
    return knex("reservations")
        .select("*")
        .where({ reservation_date: date })
        .whereNot({ status: "finished" })
        .orderBy("reservation_time");
}

function read(resId) {
    return knex("reservations").select("*").where({ reservation_id: resId }).first();
}

function updateStatus(resId, status) {
    return knex("reservations")
        .where({reservation_id: resId})
        .update({ status: status })
        .returning("*")
}

function search(mobile_number) {
    return knex("reservations")
        .whereRaw(
            "translate(mobile_number, '() -', '') like ?",
            `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date");
}

module.exports = {
    create,
    list,
    read,
    updateStatus,
    search,
}
