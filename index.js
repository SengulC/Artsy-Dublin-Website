const express = require("express");

const app = express();

const eventsRoute = require("./routes/Events");
app.use("/events", eventsRoute);

app.listen(3005, () => {
    console.log("Server running on port 3005.")
} )