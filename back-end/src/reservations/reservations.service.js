const knex = require("../db/connection")

function read(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({reservation_id: reservation_id})
        .first()
}


function list(date) {
    if (date) {
    return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time", "asc");
    } else {
        return knex("reservations")
            .select("*")
    }
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function create(newReservation) {
    return knex("reservations")
        .insert(newReservation)
}

function update(reservation_id, newStatus) {
    return knex("reservations")
        .where({ reservation_id: reservation_id})
        .update({ status: newStatus})
        .returning("*")
}

function updateReservation(updatedReservation) {
    return knex("reservations")
        .where({ reservation_id: updatedReservation.reservation_id})
        .update(updatedReservation)
        .returning("*")
}


module.exports = {
    list,
    create,
    read,
    update,
    search,
    updateReservation
}