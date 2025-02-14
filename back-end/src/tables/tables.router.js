const controller = require("./tables.controller");
const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/:table_id/seat/")
    .put(controller.seat)
    .delete(controller.makeAvailable)
    .all(methodNotAllowed);

router.route("/:table_id")
    .get(controller.read)
    .all(methodNotAllowed);

router.route("/")
    .post(controller.create)
    .get(controller.list)
    .all(methodNotAllowed);

module.exports = router;
