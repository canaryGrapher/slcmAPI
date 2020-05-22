var express = require('express');
const fs = require('fs');
var router = express.Router();

let USERNameBox = "#txtUserid";
let USERPassBox = "#txtpassword";
let LoginValidator = "#btnLogin";
let AcademicSection = "https://slcm.manipal.edu/Academics.aspx";
let homeURL = "https://slcm.manipal.edu/loginForm.aspx";
let sentAttendanceData = [];

//function to login into the SLcM portal
async function login(username, password) {
    await newPage.click(USERNameBox);
    await newPage.keyboard.type(username);
    console.log("Reached Here: Entered Username");
    await newPage.click(USERPassBox);
    await newPage.keyboard.type(password);
    console.log("Reached Here: Entered Password");
    await newPage.click(LoginValidator);
    console.log("Reached Here: Clicked Login");
    await newPage.waitForNavigation();
    console.log("Reached Here: Result Page Reached");
    await newPage.goto(AcademicSection);
    console.log("Reached Here: Reached Academic Section");
    await newPage.click("#sub-tabs-list > li:nth-child(4)");
    console.log("Reached Here: Reached Attendance Section");
    return 0;
}

async function getAttendance(homeURL, username, password, semester) {
    let arrayAttendance = [];
    await newPage.setDefaultNavigationTimeout(0);
    newPage.setViewport({ width: 1920, height: 1080 });
    await newPage.goto(homeURL);
    console.log("Reached Here: Reached the page");
    let loginStatus = await login(username, password);
    let tableContent = await newPage.evaluate(() => Array.from(document.querySelectorAll('#tblAttendancePercentage > tbody'), e => e.innerText));
    let mixedWords = tableContent.toString().split("\n");
    mixedWords.forEach(word => {
        arrayAttendance.push(word.trim());
        arrayAttendance.join("");
    });
    let patternRegEx = new RegExp("[0-9][0-9][0-9][0-9]\-[0-9][0-9][0-9][0-9]");
    let iterateOverArray;
    for (iterateOverArray = 0; iterateOverArray < arrayAttendance.length; iterateOverArray++) {
        if (patternRegEx.test(arrayAttendance[iterateOverArray])) {
            let tempPushData = {
                "subject": arrayAttendance[iterateOverArray + 2],
                "subjectCode": arrayAttendance[iterateOverArray + 1],
                "totalClasses": arrayAttendance[iterateOverArray + 4],
                "daysPresent": arrayAttendance[iterateOverArray + 5],
                "daysAbsent": arrayAttendance[iterateOverArray + 6],
                "attendancePercent": arrayAttendance[iterateOverArray + 7]
            };
            sentAttendanceData.push(tempPushData);
        }
    }
    return 0;
}


router.get("/getattendance", async function (req, res) {
    console.log("Reached Here: Got Request for attendance");
    let exitMessage = await getAttendance(homeURL, req.query.username, req.query.password);
    res.send(sentAttendanceData);
});

router.post("/getattendance", async function (req, res) {
    console.log("Reached Here: Got Request for attendance");
    let exitMessage = await getAttendance(homeURL, req.body.username, req.body.password);
    res.send(sentAttendanceData);
});

module.exports = router;