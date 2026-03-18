// this is the controller for user related stuff

const usersModel = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
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
      const { userName, email, password, birthday, location, bio, gender } =
        req.body;
      if (!userName || !email || !password) {
        return res
          .status(400)
          .send("userName, email and password are required");
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const userId = await usersModel.createUser(
        userName,
        null,
        email,
        hashedPassword,
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

  //user login
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).send("Email and password are required");
      }

      const user = await usersModel.getUserByEmail(email);
      if (!user) {
        return res.status(401).send("Invalid email or password");
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);

      if (!isMatch) {
        return res.status(401).send("Invalid email or password");
      }
      const token = jwt.sign(
        {
          userId: user.userId,
          userName: user.userName,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
      );

      res.json({
        message: "Login successful!",
        token: token,
        userName: user.userName,
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}

module.exports = new userController();
