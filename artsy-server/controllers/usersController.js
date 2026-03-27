// this is the controller for user related stuff

const usersModel = require("../models/users");
// const db = require("../db");

class userController {
  //fetch all users
  async getUserByName(req, res) {
    const userProfile = await usersModel.getUsersByName(req.params.username);
    if (!userProfile) return res.status(404).send("user not found");
    //console.log(userProfile);
    res.json(userProfile);
  }
  //fetch single user profile information
  async getUsersPool(req, res) {
    const usersPool = await usersModel.getUsersPool();
    if (!usersPool) return res.status(404).send("user not found");
    //console.log(usersPool);
    res.json(usersPool);
  }

  //create a new user
  async createUser(req, res) {
    try {
      const { userName, email, firebaseUid, birthday, location, bio, gender } =
        req.body;
      if (!userName || !email || !firebaseUid) {
        return res
          .status(400)
          .send("userName, email and firebaseUid are required");
      }

      const userId = await usersModel.createUser(
        userName,
        null,
        email,
        firebaseUid,
        birthday,
        location,
        bio,
        gender,
      );

      if (!userId) {
        return res.status(500).send("user not created");
      }

      res.status(201).json({
        message: "User registered successfully",
        userId,
      });
    } catch (error) {
      console.error("Register Error:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}

module.exports = new userController();
