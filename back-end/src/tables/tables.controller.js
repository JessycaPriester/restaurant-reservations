const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
const { table } = require("../db/connection");
//const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
//const hasProperties = require("../errors/hasProperties");


async function listTables(req, res) {
    const tables = await service.listTables();
    res.json({data: tables});
}



const CREATE_REQUIRED_PROPERTIES = [
    "table_name",
    "capacity"
]

function hasRequiredPropertiesCreate(req, res, next) {
    const { data = {}} = req.body
    const missingProperties = [];
  
    for (const property of CREATE_REQUIRED_PROPERTIES) {
      if (!data[property]) {
        missingProperties.push(property);
      }
    }
  
    if (missingProperties.length > 0) {
      return res.status(400).json({
        error: `Missing required properties: ${missingProperties.join(', ')}`,
      });
    }
  
    next();
  }

function hasValidTableName(req, res, next) {
    const {table_name} = req.body.data;

    if (!table_name) {
        return next({
            status:400,
            message: "Table must have table name"
        })
    }

    if (table_name.length < 2) {
        return next({
            status: 400,
            message: "Table name must be at least two characters long!"
        })
    };
    next();
}

function hasValidCapacity(req, res, next) {
    const {capacity} = req.body.data;
    const isNumber = Number.isInteger(capacity);

    if (!isNumber) {
        return next({
            status: 400,
            message: "Capacity must be a number!"
        })
    } 

    if (capacity < 1) {
        return next({
            status: 400,
            message: "Capacity must be at least 1!"
        })
    }
    next();
}

async function create(req, res, next) {
    try {
        const { data: {table_name, capacity} = {} } = req.body;
        const newTable = {
            table_name: table_name,
            capacity: capacity
        };

        await service.create(newTable);
        res.status(201).json({ data: newTable });
    } catch (error) {
        next(error)
    }
}

function tableExists(req, res, next) {
    console.log(req.params.tableId)
    service
        .read(req.params.tableId)
        .then((table) => {
            if (table) {
                res.locals.table = table;
                return next()
            }
            next({
                status: 404, 
                message: "Table cannot be found"
            })
        })
        .catch(next)
}



const UPDATE_REQUIRED_PROPERTIES = [
    "reservation_id"
]

function hasRequiredPropertiesUpdate(req, res, next) {
    const { data = {}} = req.body
    const missingProperties = [];
  
    for (const property of UPDATE_REQUIRED_PROPERTIES) {
      if (!data[property]) {
        missingProperties.push(property);
      }
    }
  
    if (missingProperties.length > 0) {
      return res.status(400).json({
        error: `Missing required properties: ${missingProperties.join(', ')}`,
      });
    }
  
    next();
  }


function seatCapacityValid(req, res, next) {

}

function tableIsUnoccuppied(req, res, next) {
    const table = res.locals.table
    const reservation_id = table.reservation_id

    if (reservation_id) {
        next({
            status: 400,
            message: "Table is already booked"
        })
    }
    res.locals.table = table
    next()
}

async function read(req, res, next) {
    const tableId = res.locals.table.table_id
    const table = await service.read(tableId);
    res.json({data: table}).status(200);
}

async function update(req, res, next) {
    const table = res.locals.table
    const updatedTable = {
        ...req.body,
        table_id: table.table_id
    }
    console.log(req.body)
    await service.update(updatedTable)
    res.json({ data: await service.read(updatedTable.table_id)})
}
module.exports = {
    listTables,
    create: [hasRequiredPropertiesCreate, hasValidTableName, hasValidCapacity, create],
    update: [tableExists, hasRequiredPropertiesUpdate, tableIsUnoccuppied, update],
    read: [tableExists, read]
}