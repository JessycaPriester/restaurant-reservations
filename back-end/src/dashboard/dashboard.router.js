const router = require("express").Router();
const controller = require("./dashboard.controller");

router.route("/").get(controller.list).get(controller.listTables);

module.exports = router;