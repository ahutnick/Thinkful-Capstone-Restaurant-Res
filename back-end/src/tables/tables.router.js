const controller = require("./tables.controller");
const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/")
    .post(controller.create)
    .get(controller.list)
    .all(methodNotAllowed);

module.exports = router;