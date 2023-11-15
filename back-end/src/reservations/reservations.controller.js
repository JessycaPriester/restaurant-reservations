const knex = require("../db/connection")
const reservations = require('../db/seeds/00-reservations.json')
/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const date = req.query.date;

  if (!date) {
    return res.status(400).json({ error: 'Missing date parameter' });
  }

  if (reservations) {
    try {
      // Assuming you have a 'reservations' table in your database
      const data = await knex('reservations')
        .where('reservation_date', '=', date)
        .select();

      if (data.length > 0) {
        res.json({ data });
      } else {
        res.json({ message: 'No matching reservation found.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = {
  list,
};
