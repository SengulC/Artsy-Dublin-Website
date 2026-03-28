// this is the router for user related stuff

const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.get("/", usersController.getUsersPool);
router.get("/:username", usersController.getUserByName);
router.get("/:username/posts", usersController.getUserPosts);
router.get("/:username/attended-events", usersController.getUserAttendedEvents);
router.get("/:username/stats", usersController.getUserStats);
router.get("/:username/journal", usersController.getUserJournal);

//router.delete('/:username',usersController.deleteUser);
router.post("/register", usersController.createUser);

module.exports = router;
