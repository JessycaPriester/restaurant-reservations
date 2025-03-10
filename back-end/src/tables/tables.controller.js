const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/// VALIDATION FUNCTIONS ///


// Check that the create table form has all the required properties 
const CREATE_REQUIRED_PROPERTIES = [
    "table_name",
    "capacity"
]

function hasRequiredPropertiesCreate(req, res, next) {
    const { data = {}} = req.body;
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

// Check that the create table form has a table name and that it's 2 or more characters long
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
            message: "table_name must be two or more characters"
        })
    };
    next();
}

// Check that the create table form has a capacity that is a number and is at least 1
function hasValidCapacity(req, res, next) {
    const {capacity} = req.body.data;
    const isNumber = Number.isInteger(capacity);

    if (!isNumber) {
        return next({
            status: 400,
            message: "Table capacity must be a number"
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

// Check that the table exists
function tableExists(req, res, next) {
    service
        .read(req.params.tableId)
        .then((table) => {
            if (table) {
                res.locals.table = table;
                return next()
            }
            next({
                status: 404, 
                message: `Table ${req.params.tableId} does not exist`
            })
        })
        .catch(next)
}

// Check that the seat form has the required properties
function hasRequiredPropertiesUpdate(req, res, next) {
    const table = res.locals.table;
    const { data: {reservation_id} = {}} = req.body;
  
    if (!reservation_id) {
        return next({
            status: 400,
            message: "Reservation requires a reservation_id"
        })
    }
    res.locals.table = table;
    next();
  }

// Check that reservation exists
async function reservationExists(req, res, next) {
    const {reservation_id} = req.body.data;
    
    if (!reservation_id) {
        next({
            status: 400,
            message: "Reservation ID is missing in the request body",
        });
        return;
    }

    const reservation = await reservationsService.read(reservation_id);

    if (!reservation) {
        next({
            status: 404,
            message: `Reservation ${reservation_id} does not exist`
        })
    }
    res.locals.reservation = reservation;
    next();
}

// Check that the seat form has a capacity that is equal to or larger than the reservation party size
async function hasSufficientCapacity(req, res, next) {
    const table = res.locals.table;
    const reservation = res.locals.reservation;

    if (table.capacity < reservation.people) {
        next({
            status: 400, 
            message: "Party size is larger than table capacity"
        })
    }
    res.locals.table = table;
    res.locals.reservation = reservation;
    next();
  }

// Check that the table is unoccupied 
function tableIsUnoccupied(req, res, next) {
    const table = res.locals.table;
    const reservation_id = table.reservation_id;


    if (reservation_id) {
        next({
            status: 400,
            message: "Table is occupied"
        })
    }
    res.locals.table = table;
    next();
}

// Check that the reservation is not already seated 
function reservationIsNotSeated(req, res, next) {
    const reservation = res.locals.reservation;

    if (reservation.status === "seated") {
        next({
            status: 400, 
            message: "Reservation has already been seated"
        })
    }
    next();
}

// Checks if table is occupied
function tableIsOccupied(req, res, next) {
    const table = res.locals.table;
   
    if (!table.reservation_id) {
        next({
            status: 400,
            message: "Table is not occupied"
        })
    }
    res.locals.table = table;
    next();
}



/// CRUD FUNCTIONS ///


// List all the tables
async function listTables(req, res) {
    const tables = await service.listTables();
    res.json({data: tables});
}

// Create a table
async function create(req, res, next) {
    try {
        const { data: {table_name, capacity, reservation_id} = {} } = req.body;
        const newTable = {
            table_name: table_name,
            capacity: capacity,
            reservation_id: reservation_id
        };

        const data = await service.create(newTable);
        res.status(201).json({ data: data });
    } catch (error) {
        next(error);
    }
}

// Finds the table
async function read(req, res, next) {
    const tableId = res.locals.table.table_id;
    const table = await service.read(tableId);
    res.json({data: table}).status(200);
}

// Updates/seats the table
async function update(req, res, next) {
    const table = res.locals.table;
    const updatedTable = {
        table_id: table.table_id,
        reservation_id: req.body.data.reservation_id,
    };

    await reservationsService.update(req.body.data.reservation_id, "seated");
    const results = await service.update(updatedTable);
    res.json({ data: results});
}

// Deletes the reservation assigned to the table
async function deleteTableAssignment(req, res, next) {
    const table = res.locals.table;

    await reservationsService.update(table.reservation_id, "finished");
    await service.deleteTableAssignment(table.table_id);

    res.json({ data: await service.read(table.table_id)});
}


module.exports = {
    listTables: [asyncErrorBoundary(listTables)],
    create: [hasRequiredPropertiesCreate, hasValidTableName, hasValidCapacity, asyncErrorBoundary(create)],
    update: [tableExists, hasRequiredPropertiesUpdate, asyncErrorBoundary(reservationExists), hasSufficientCapacity, tableIsUnoccupied, reservationIsNotSeated, asyncErrorBoundary(update)],
    read: [tableExists, asyncErrorBoundary(read)],
    delete: [tableExists, tableIsOccupied, asyncErrorBoundary(deleteTableAssignment)]
}