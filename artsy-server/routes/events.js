// this is the router for event related stuff

const express = require("express");
const router = express.Router();
const controller = require("../controllers/eventsController");

router.get("/", controller.get);
router.get("/update/:type", controller.updateByType);
router.get("/:eventid", controller.getEventById);
router.get("/all/:eventid", controller.getEventRepeatsById)

module.exports = router;