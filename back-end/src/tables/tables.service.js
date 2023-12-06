const knex = require("../db/connection");

function listTables() {
    return knex("tables")
        .select("*")
        .orderBy('table_name')
}

function create(newTable) {
    return knex("tables")
        .insert(newTable)
        .returning("*")
        .then((createdTable) => createdTable[0])
}

// TRIGGERING
function read(table_id) {
    return knex("tables")
        .select("*")
        .where({ table_id: table_id })
        .first()
}

function update(updatedTable) {
    return knex("tables")
        .where({ table_id: updatedTable.table_id })
        .update(updatedTable)
        .returning("*")
}

function deleteTableAssignment(table_id) {
    return knex('tables')
        .where({ table_id: table_id})
        .update({ reservation_id: null})
}

module.exports = {
    listTables,
    create,
    read, 
    update,
    deleteTableAssignment
}