const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));//static path

const eventsRoute = require("./routes/events");
app.use("/events", eventsRoute);

const usersRoute = require("./routes/users")
app.use("/users", usersRoute);

const postsRoute = require("./routes/posts")
app.use("/posts", postsRoute);

app.listen(3005, () => {
    console.log("Server running on http://localhost:3005")
} )