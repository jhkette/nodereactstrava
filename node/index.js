const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const session = require('express-session')

const authRoutes = require("./routes/auth")
const activityRoutes = require("./routes/activities")


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

const oneDay = 1000 * 60 * 60 * 24;
// app.use(session({
//     secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
//     saveUninitialized:true,
//     cookie: { maxAge: oneDay },
//     resave: false 
// }));

// call mongoose to connect to mongodb database
mongoose.connect(process.env.DB_CONNECTOR)
.then(() => console.log('Connected Successfully'))

app.use(cookieParser());

// app.use(express.json());

app.use(bodyParser.json())


app.use('/auth', authRoutes)

app.use('/user', activityRoutes)

app.get("/", (req, res) => {
  res.send("Strava app!");
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
