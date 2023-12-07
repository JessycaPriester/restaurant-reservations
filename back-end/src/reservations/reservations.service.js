const knex = require("../db/connection")

// Gets the reservation with the matching id
function read(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({reservation_id: reservation_id})
        .first()
}


// Lists all reservations with matching date
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

// Lists all the reservations with matching phone number
function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}


// Creates a new reservation 
function create(newReservation) {
    return knex("reservations")
        .insert(newReservation)
        .returning("*")
        .then((createdReservation) => createdReservation[0])
}

// Updates a reservations status
function update(reservation_id, newStatus) {
    return knex("reservations")
        .where({ reservation_id: reservation_id})
        .update({ status: newStatus})
        .returning("*")
}


// Updates a reservation
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