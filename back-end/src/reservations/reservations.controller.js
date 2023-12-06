const knex = require("../db/connection")
const reservations = require('../db/seeds/00-reservations.json')
const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
/**
 * List handler for reservation resources
 */
async function list(request, response) {
  const date = request.query.date;
  console.log("MY DATE", typeof date)
  const phoneNumber = request.query.mobile_number;
  console.log(phoneNumber)
  let res

  if (date) {
    const reservations = await service.list(date)
    res = reservations.filter((reservation) => {
      return reservation.status !== "finished"
    }); 
  } else if (phoneNumber) {
    res = await service.search(phoneNumber)
  } else {
   res = await service.list()
  }

  response.json({ data: res });
}

function reservationExists(req, res, next) {
  console.log(req.params.reservationId)
  service
      .read(req.params.reservationId)
      .then((reservation) => {
          if (reservation) {
              res.locals.reservation = reservation;
              return next()
          }
          next({
              status: 404, 
              message: "99"
          })
      })
      .catch(next)
}

async function read(req, res, next) {
  const reservationId = res.locals.reservation.reservation_id
  const reservation = await service.read(reservationId);
  res.json({data: reservation}).status(200);
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
  const { data = {}} = req.body
  const missingProperties = [];

  for (const property of REQUIRED_PROPERTIES) {
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

function hasValidProperties(req, res, next) {
  const { reservation_date, reservation_time, people} = req.body.data;
  const isNumber = Number.isInteger(people);
  const day = `${reservation_date}  ${reservation_time}`;
  const today = new Date();
  const date = new Date(day);
  const timeFormat = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  const dateFormat = /^\d{4}\-\d{1,2}\-\d{1,2}$/;

  if (!isNumber || people <= 0) {
    return next({
      status: 400,
      message: "You must make a reservation for 1 or more people",
    });
  }

  if (!reservation_date.match(dateFormat)) {
    return next({
      status: 400,
      message: `reservation_date is not a valid date!`,
    });
  }

  if (!reservation_time.match(timeFormat)) {
    return next({
      status: 400,
      message: `reservation_time is not a valid time!`,
    });
  }

  next()
}

function hasValidDate(req,res, next) {
  const {reservation_date} = req.body.data;
  const {reservation_time} = req.body.data;

  // Check if reservation date is on a day restaurant is closed 
  const dateParts = reservation_date.split('-');
  const reservationDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
          
  if (reservationDate.getDay() === 2) {
    return next({
      status:400,
      message:'The restaurant is closed on Tuesdays.'
    })
  };

  // Check if reservation date and time are in the future
  const currentDate = new Date()

  const reservationDateDate = reservationDate.toLocaleDateString('en-US').split('T')[0]
  const currentDateDate = currentDate.toLocaleDateString('en-US').split('T')[0]

  const currentHours = currentDate.getHours().toString().padStart(2, '0');
  const currentMinutes =  currentDate.getMinutes().toString().padStart(2, '0');
  const currentTime = `${currentHours}:${currentMinutes}`;

  console.log(currentDateDate)
  console.log(reservationDateDate)


  if (reservationDateDate === currentDateDate) {
    if (reservation_time < currentTime) {
      return next({
        status: 400,
        message: 'Invalid reservation time. Please choose a future time.'
      })
    }
  }


  const resDate = new Date(reservationDate)

  console.log(currentDate)
  console.log(resDate)
  if (resDate < currentDate) {
    return next({
      status: 400,
      message: 'Invalid reservation date. Please choose a future date.'
    })
  }
  next();
}

// Check if a reservation time is during operating hours
function hasValidTime(req, res, next) {
  const { reservation_time } = req.body.data

  if (reservation_time < '10:30' || reservation_time > '21:30') {
    return next({
      status: 400,
      message: 'reservation_time'
    })
  }
  next()
}

function reservationStatusIsBooked(req, res, next) {
  const { status } = req.body.data

  if (status === "seated") {
    return next({
      status: 400,
      message: 'seated'
    })
  }

  if (status === "finished") {
    return next({
      status: 400,
      message: 'finished'
    })
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

    const data = await service.create(newReservation);
    res.status(201).json({ data: data });
  } catch (error) {
    next(error);
  }
}

function reservationStatusIsValid(req, res, next) {
  const reservation = res.locals.reservation
  const requestStatus = req.body.data.status
  //console.log(req.body.data.status)
  console.log(requestStatus)

  if (reservation.status === "finished") {
    return next({
      status: 400,
      message: 'finished'
    })
  }

  if (requestStatus !== "booked") {
    if (requestStatus !== "seated") {
      if (requestStatus !== "finished") {
        if (requestStatus !== "cancelled") {
          return next({
            status: 400,
            message: 'unknown'
          })
        }
      }
    }
  } 
  res.locals.reservation = reservation
  next()
}

async function update(req, res, next) {
  const {status} = req.body.data
  const reservation = res.locals.reservation
  
  await service.update(reservation.reservation_id, status)
  res.json({ data: await service.read(reservation.reservation_id)})
}

async function updateReservation(req, res, next) {
  const reservation = res.locals.reservation

  console.log(req.body)

  updatedReservation = {
    ...req.body.data,
    reservation_id: reservation.reservation_id
  }

  await service.updateReservation(updatedReservation)
  res.json({ data: await service.read(reservation.reservation_id) })
}


module.exports = {
  list,
  create: [hasRequiredProperties, hasValidProperties, hasValidDate, hasValidTime, reservationStatusIsBooked, asyncErrorBoundary(create)],
  read: [reservationExists, asyncErrorBoundary(read)],
  update: [reservationExists, reservationStatusIsValid, asyncErrorBoundary(update)],
  updateReservation: [hasRequiredProperties, hasValidProperties, hasValidDate, hasValidTime, reservationExists, asyncErrorBoundary(updateReservation)]
};