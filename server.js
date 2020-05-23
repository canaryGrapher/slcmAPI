var bodyParser = require('body-parser');
const puppeteer = require("puppeteer");
const express = require("express");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

PORT = process.env.PORT || 3000;
// all routes come here
const getScores = require('./routes/getmarks.js');
const getAttendance = require('./routes/getattendance.js');
const getProfile = require('./routes/getprofile.js');
const validateUSER = require('./routes/validateuser.js');

//for getting marks of all the subjects
app.all("/getscores", getScores);

// for getting attendances of all subjects
app.all("/getattendance", getAttendance);

//for getting profile of person
app.all("/getprofile", getProfile);

//for gettting user credentials validations
app.all("/validateuser", validateUSER);


app.listen(PORT, async function () {
    console.log("The server is now listening on port", PORT);
    browser = await puppeteer.launch();
    newPage = await browser.newPage();
    console.log("Reached Here: Browser Open");
});