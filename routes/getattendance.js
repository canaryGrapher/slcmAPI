var express = require('express');
const axios = require('axios');
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

async function getAttendance(username, password) {
    try {
        let arrayAttendance = [];
        await newPage.setDefaultNavigationTimeout(10000);
        newPage.setViewport({ width: 1920, height: 1080 });
        await newPage.goto(homeURL);
        console.log("Reached Here: Reached the page");
        await login(username, password);
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
        return ["requestSuccess", "The request was completed successfully"];
    }
    catch (errorServer) {
        console.log(errorServer);
        console.log("There is an error");
        return ["serverError", "ERROR: It is either us, or SLcM is being a bitch. No hard feelings."];
    }
}

router.get("/getattendance", async function (req, res) {
    console.log("Reached Here: Got Request for attendance");
    if (req.query.novalidate == "true") {
        let exitMessage = await getAttendance(req.query.username, req.query.password);
        if (exitMessage[0] == "serverError") {
            res.send(exitMessage[1]);
        }
        else {
            res.send(sentAttendanceData);
        }
    }
    else if (req.query.novalidate == "false" || req.query.novalidate == null) {
        axios.get(`http://localhost:${PORT}/validateuser?username=${req.query.username}&password=${req.query.password}`).then(async response => {
            let testCredentials = response.data;
            if (testCredentials.credentialsValid == true) {
                console.log("Login SuccessFull");
                let exitMessage = await getAttendance(req.query.username, req.query.password);
                if (exitMessage[0] == "serverError") {
                    res.send(exitMessage[1]);
                }
                else {
                    res.send(sentAttendanceData);
                }
            }
            else {
                console.log("Login Unsuccessful");
                res.send("Invalid URL was provided");
            }
        }).catch(error => {
            console.log(error);
            res.send("There is a problem with the server. Please try again after some time");
        });
    }
    else {
        console.log("Invalid request format was sent");
        res.send("Invalid URL format. Read the documentations.");
    }
});

router.post("/getattendance", async function (req, res) {
    console.log("Reached Here: Got Request for attendance");
    if (req.body.novalidate == "true") {
        let exitMessage = await getAttendance(req.body.username, req.body.password);
        if (exitMessage[0] == "serverError") {
            res.send(exitMessage[1]);
        }
        else {
            res.send(sentAttendanceData);
        }
    }
    else if (req.body.novalidate == "false" || req.body.novalidate == null) {
        axios.get(`http://localhost:${PORT}/validateuser?username=${req.body.username}&password=${req.body.password}`).then(async response => {
            let testCredentials = response.data;
            if (testCredentials.credentialsValid == true) {
                console.log("Login SuccessFull");
                let exitMessage = await getAttendance(req.body.username, req.body.password);
                if (exitMessage[0] == "serverError") {
                    res.send(exitMessage[1]);
                }
                else {
                    res.send(sentAttendanceData);
                }
            }
            else {
                console.log("Login Unsuccessful");
                res.send("Invalid URL was provided");
            }
        }).catch(error => {
            console.log(error);
            res.send("There is a problem with the server. Please try again after some time");
        });
    }
    else {
        console.log("Invalid request format was sent");
        res.send("Invalid URL format. Read the documentations.");
    }
});

module.exports = router;