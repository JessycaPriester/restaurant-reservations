const router = require("express").Router();
const controller = require("./tables.controller");

router.route("/").get(controller.listTables).post(controller.create).put(controller.update)
router.route("/:tableId").put(controller.update).get(controller.read)

module.exports = router;