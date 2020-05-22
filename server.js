var bodyParser = require('body-parser');
const puppeteer = require("puppeteer");
const express = require("express");
const USERNameBox = "#txtUserid";
const USERPassBox = "#txtpassword";
const LoginValidator = "#btnLogin";
const AcademicSection = "https://slcm.manipal.edu/Academics.aspx";
const dataAttendance = "#tblAttendancePercentage";
const homeURL = "https://slcm.manipal.edu/loginForm.aspx";
let PORT = process.env.PORT || 3000;
sentData = [];

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// all routes come here
const getScores = require('./routes/getmarks.js');


//for getting marks of all the subjects
app.all("/getscores", getScores);

app.listen(PORT, async function () {
    console.log("The server is now listening on port", PORT);
    browser = await puppeteer.launch();
    newPage = await browser.newPage();
    console.log("Reached Here: Browser Open");
}).setTimeout(600000);