const knex = require("../db/connection")

function list(date) {
    if (date) {
    return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time", "asc");
    }
}


function create(newReservation) {
    return knex("reservations")
        .insert(newReservation)
}

module.exports = {
    list,
    create,
}