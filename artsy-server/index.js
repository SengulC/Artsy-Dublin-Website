const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const cron = require('node-cron');

const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5500"],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

const genresRouter = require("./routes/genres");
app.use("/genres", genresRouter);

const eventsRoute = require("./routes/events");
const eventsModel = require("./models/events");
app.use("/events", eventsRoute);
// * * * * *: (minute, hour, day of month, month, day of week)
cron.schedule('0 0 1 */1 *', async () => { 
// cron.schedule("*/1 * * * *", async () => { // every 3 min.s - FOR TESTING
    console.log('It is the first day of the month. Updating events.');
    try {
      await eventsModel.fetchFilmsAndPopulate();
      await eventsModel.fetchLiveEventsAndPopulate("Music");
      await eventsModel.fetchLiveEventsAndPopulate("Arts-&-Theater");
    }
    catch (error) {
      console.error('Task failed:', error);
    }
});

const usersRoute = require("./routes/users");
app.use("/users", usersRoute);

const authRoute = require("./routes/auth");
app.use("/api", authRoute);

//the images user used can be visit public
app.use("/uploads", express.static("public/uploads"));

app.listen(3005, () => {
  console.log("Server running on http://localhost:3005");
});
