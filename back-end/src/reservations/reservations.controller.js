const knex = require("../db/connection")
const reservations = require('../db/seeds/00-reservations.json')
const service = require("./reservations.service")
/**
 * List handler for reservation resources
 */
async function list(request, response) {
  const date = request.query.date;
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
  const missingProperties = [];

  for (const property of REQUIRED_PROPERTIES) {
    if (!req.body.data[property]) {
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

function peopleIsANumber(req, res, next) {
  const people = req.body.data.people

  if (isNaN(people)) {
    return res.status(400).json({
      error: `People must be a number`,
    });
  }
  next()
}


async function create(req, res, next) {
  try {
    const { data: { first_name, last_name, mobile_number, reservation_date, reservation_time, people } = {} } = req.body;
    const newReservation = {
      first_name: first_name,
      last_name: last_name,
      mobile_number: mobile_number,
      reservation_date: reservation_date,
      reservation_time: reservation_time,
      people: people
    };

    await service.create(newReservation);
    res.status(201).json({ data: newReservation });
  } catch (error) {
    next(error);
  }
}


module.exports = {
  list,
  create: [hasRequiredProperties, peopleIsANumber, create]
};
