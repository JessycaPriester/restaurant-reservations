const router = require("express").Router();
const controller = require("./tables.controller");

router.route("/:tableId/seat").put(controller.update).delete(controller.delete)
router.route("/:tableId").get(controller.read)
router.route("/").get(controller.listTables).post(controller.create).put(controller.update)

module.exports = router;