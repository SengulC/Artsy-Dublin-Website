require("dotenv").config();
const session = require("express-session");
const express = require("express");
<<<<<<< Updated upstream
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); //static path
=======
const app = express();
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());
>>>>>>> Stashed changes

const eventsRoute = require("./routes/events");
app.use("/events", eventsRoute);

const usersRoute = require("./routes/users");
app.use("/users", usersRoute);

//related to posts(diaries)
const postsRoute = require("./routes/posts");
app.use("/posts", postsRoute);

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views/login.html"));
});

app.get("/homepage", (req, res) => {
  res.sendFile(path.join(__dirname, "views/userstate.html"));
});
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views/createUser.html"));
});
app.get("/userstate", (req, res) => {
  res.sendFile(path.join(__dirname, "views/userstate.html"));
});

app.get("/api/check-auth", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ isLoggedIn: false, message: "No token" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your_jwt_secret",
    (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ isLoggedIn: false, message: "Invalid token" });
      }

      res.json({
        isLoggedIn: true,
        userName: decoded.userName,
      });
    },
  );
});

app.listen(3005, () => {
  console.log("Server running on http://localhost:3005");
});
