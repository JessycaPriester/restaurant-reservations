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
  "firstName",
  "lastName",
  "mobileNumber",
  "reservationDate",
  "reservationTime",
  "partySize"
]

function hasRequiredProperties(req, res, next) {
  const { data = {}} = req.body;
  console.log(data)

  for (const property of REQUIRED_PROPERTIES) {
    if (!data[property]) {
      return res.status(400).json({
        error: `Missing required property: ${property}`,
      });
    }
  }

  next();
}

function partySizeIsValid(req, res, next) {
  const partySize = req.body.people;

  if (partySize <= 0) {
    return res.status(400).json({
      error: `There must be at least one person`
    })
  }

  next()
}

async function create(req, res, next) {
  const { data: {firstName, lastName, mobileNumber, reservationDate, reservationTime, partySize} = {}} = req.body;
  const newReservation = {
    first_name: firstName,
    last_name: lastName,
    mobile_number: mobileNumber,
    reservation_date: reservationDate,
    reservation_time: reservationTime,
    people: partySize
  }

  await service.create(newReservation)
  res.json({ data: res })
}

module.exports = {
  list,
  create: [hasRequiredProperties, partySizeIsValid, create]
};
