const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')


const authRoutes = require("./routes/auth")
const activityRoutes = require("./routes/activities")
const runDataRoutes = require("./routes/datasets")


const app = express();

const port = 3000;

/* call and use relevant middleware
 */
// call cors module - to stop cross origin resource sharing errors from the client
// side
app.use(
  cors({
    credentials: true,
      // credentials: true, // allows cookies to be sent to client
      origin: process.env.ORIGIN, // from this url (ie the client)- saved in the dotenv file
      // optionsSuccessStatus: 200, // 
  })
);



// call mongoose to connect to mongodb database
mongoose.connect(process.env.DB_CONNECTOR)
.then(() => console.log('Connected to database successfully'))

app.use(cookieParser());

// app.use(express.json());

app.use(bodyParser.json())


app.use('/auth', authRoutes)

app.use('/user', activityRoutes)

app.use('/data', runDataRoutes)

app.get("/", (req, res) => {
  res.send("Strava app!");
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
