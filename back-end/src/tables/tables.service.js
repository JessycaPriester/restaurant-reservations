const knex = require("../db/connection");


// Lists all the tables
function listTables() {
    return knex("tables")
        .select("*")
        .orderBy('table_name')
}


// Creates a new table
function create(newTable) {
    return knex("tables")
        .insert(newTable)
        .returning("*")
        .then((createdTable) => createdTable[0])
}

// Lists the table with the matching id
function read(table_id) {
    return knex("tables")
        .select("*")
        .where({ table_id: table_id })
        .first()
}

// Updates the table with the matching id
function update(updatedTable) {
    return knex("tables")
        .where({ table_id: updatedTable.table_id })
        .update(updatedTable)
        .returning("*")
}

// Unassigens a reservation from a table
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