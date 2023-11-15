const knex = require("../db/connection");

async function list(req, res) {
    const date = req.query.date;

    res.redirect(`/reservations?date=${date}`)
}

module.exports = {
    list,
}