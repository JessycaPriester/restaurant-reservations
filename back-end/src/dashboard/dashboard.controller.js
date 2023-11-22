const knex = require("../db/connection");
const service = require("./dashboard.service")

async function list(req, res) {
    const date = req.query.date;

    res.redirect(`/reservations?date=${date}`)
}

async function listTables(req, res) {
    const tables = await service.listTables();
    res.json({ data: tables })
}

module.exports = {
    list,
    listTables
}