const router = require("express").Router();
const controller = require("./tables.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/:tableId/seat").put(controller.update).delete(controller.delete).all(methodNotAllowed);
router.route("/:tableId").get(controller.read).all(methodNotAllowed);
router.route("/").get(controller.listTables).post(controller.create).put(controller.update).all(methodNotAllowed);

module.exports = router;