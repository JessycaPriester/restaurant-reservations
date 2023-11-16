const knex = require("../db/connection")
const reservations = require('../db/seeds/00-reservations.json')
const service = require("./reservations.service")
/**
 * List handler for reservation resources
 */
async function list(request, response) {
  const date = request.query.date;
  console.log(date)
  //const mobile_number = request.query.mobile_number;
  const reservations = await service.list(date);
  const res = reservations.filter(
    (reservation) => reservation.status !== "finished"
  );
  response.json({ data: res });
}

const REQUIRED_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
]

function hasRequiredProperties(req, res, next) {
  const missingProperties = []
  for (const property of REQUIRED_PROPERTIES) {
    if (!req.body.data[property]) {
      missingProperties.push(property)
    }
  }
  

  console.log(req.body.data)
  console.log(missingProperties)

  if (missingProperties.length > 0 || !req.body.data) {
    return res.status(400).json({
      error: `Missing required property: ${missingProperties.join(", ")}`,
    });
  } else {
    next()
  }
}

/*function isValidDate(value) {
  // Check if the value is an instance of the Date object and not NaN
  return value instanceof Date && !isNaN(value);
}

function hasValidDateProperty(req, res, next) {
  const { data } = req.body;

  // Check if reservationDate is a valid date
  if (!isValidDate(new Date(data.reservationDate))) {
    return res.status(400).json({
      error: 'Invalid reservation date format',
    });
  }

  // Continue to the next middleware if the date is valid
  next();
}

function partySizeIsValid(req, res, next) {
  const partySize = req.body.people;

  if (partySize <= 0 || isNaN(partySize)) {
    return res.status(400).json({
      error: `There must be at least one person`
    })
  }

  next()
} */

async function create(req, res, next) {
  try {
    const { data: { firstName, lastName, mobileNumber, reservationDate, reservationTime, partySize } = {} } = req.body;
    const newReservation = {
      first_name: firstName,
      last_name: lastName,
      mobile_number: mobileNumber,
      reservation_date: reservationDate,
      reservation_time: reservationTime,
      people: partySize
    };

    await service.create(newReservation);
    res.status(201).json({ data: newReservation });
  } catch (error) {
    next(error);
  }
}


module.exports = {
  list,
  create: [hasRequiredProperties, create]
};
