// const Regex = require("regex");
const fs = require('fs');
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

async function login(username, password) {
    let loginSuccess = true;
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
    await newPage.click("#sub-tabs-list > li:nth-child(6)");
    console.log("Reached Here: Reached Marks Section");
    return "Login Successful";
}

async function getSubjects() {
    let subjects = await newPage.evaluate(() => Array.from(document.querySelectorAll('#accordion1 > div:nth-child(2n+2) > div.panel-heading > h4 > a'), e => e.innerText));
    //adding all the subjects to an array subjectListArray[]
    let subjectListArray = [];
    subjects.forEach(subjects => {
        subjectListArray.push(subjects.trim().slice(14));
    });
    return subjectListArray;
}

async function getSubjectScore(SubjectArray) {
    let subjectScoreArray = [];
    let iterateSubjects = 0;
    console.log(SubjectArray);
    let subjectScore = await newPage.evaluate(() => Array.from(document.querySelectorAll('#accordion1 > div:nth-child(2n+2) > div.panel-collapse > div.panel-body > div.table-responsive'), e => e.innerText));
    subjectScore.forEach(Score => {
        eval(`subjectScore${iterateSubjects} = [];`);
        console.log(`CreatedsubjectScore${iterateSubjects} = []`);
        //using RefEx to remove all unnecessary whitespaces
        let scoreArray = (Score.replace(/\s+/g, ' ').slice(48) + "_ENDS_HERE_").toString().split(" ");
        let arrayCounter = 0;
        Sessional1 = "", Sessional2 = "", Assignment1 = "", Assignment2 = "", Assignment3 = "", Assignment4 = "";
        //search for scores in the string
        if (!SubjectArray[iterateSubjects].split("  ")[1].includes("LAB")) {
            scoreArray.forEach(word => {
                if (word == "Sessional" && scoreArray[arrayCounter + 1] == "1") {
                    eval(`subjectScore${iterateSubjects}.push("Sessional 1")`);
                    Sessional1 = scoreArray[arrayCounter + 3];
                    eval(`subjectScore${iterateSubjects}.push(${scoreArray[arrayCounter + 3]})`);
                }
                if (word == "Sessional" && scoreArray[arrayCounter + 1] == "2") {
                    eval(`subjectScore${iterateSubjects}.push("Sessional 2")`);
                    Sessional2 = scoreArray[arrayCounter + 3];
                    eval(`subjectScore${iterateSubjects}.push(${scoreArray[arrayCounter + 3]})`);
                }
                if (word == "Assignment" && scoreArray[arrayCounter + 1] == "1") {
                    eval(`subjectScore${iterateSubjects}.push("Assignment 1")`);
                    Assignment1 = scoreArray[arrayCounter + 3];
                    eval(`subjectScore${iterateSubjects}.push(${scoreArray[arrayCounter + 3]})`);
                }
                if (word == "Assignment" && scoreArray[arrayCounter + 1] == "2") {
                    eval(`subjectScore${iterateSubjects}.push("Assignment 2")`);
                    Assignment2 = scoreArray[arrayCounter + 3];
                    eval(`subjectScore${iterateSubjects}.push(${scoreArray[arrayCounter + 3]})`);
                }
                if (word == "Assignment" && scoreArray[arrayCounter + 1] == "3") {
                    eval(`subjectScore${iterateSubjects}.push("Assignment 3")`);
                    Assignment3 = scoreArray[arrayCounter + 3];
                    eval(`subjectScore${iterateSubjects}.push(${scoreArray[arrayCounter + 3]})`);
                }
                if (word == "Assignment" && scoreArray[arrayCounter + 1] == "4") {
                    eval(`subjectScore${iterateSubjects}.push("Assignment 4")`);
                    Assignment4 = scoreArray[arrayCounter + 3];
                    eval(`subjectScore${iterateSubjects}.push(${scoreArray[arrayCounter + 3]})`);
                }
                arrayCounter += 1;
            });
            console.log(eval(`subjectScore${iterateSubjects}`));
            let subject = SubjectArray[iterateSubjects].split("  ")[1];
            let subjectCode = SubjectArray[iterateSubjects].split("  ")[0];
            let tempPushData = {
                "subject": subject,
                "subjectCode": subjectCode,
                "type": "theory",
                "sessional1": Sessional1,
                "sessional2": Sessional2,
                "assignment1": Assignment1,
                "assignment2": Assignment2,
                "assignment3": Assignment3,
                "assignment4": Assignment4
            }
            sentData.push(tempPushData);
        }
        else {
            console.log("This Subject is a lab");
        }

        iterateSubjects += 1;
    });

}

async function getMarks(homeURL, username, password, semester) {
    await newPage.setDefaultNavigationTimeout(0);
    newPage.setViewport({ width: 1920, height: 1080 });
    await newPage.goto(homeURL);
    console.log("Reached Here: Reached the page");
    //function to log into the browser and reach the desired page
    let loginStatus = await login(username, password);
    console.log(loginStatus);
    if (loginStatus == "Login Unsuccessful") {
        return "UnsuccessFull Login";
    }
    else {
        //get the list of subjects as an array in the variable SubjectArray
        let SubjectArray = await getSubjects();
        let subjectScoring = await getSubjectScore(SubjectArray);
        console.log("Reached Here: File Write Complete");
        await browser.close();
        return "Finished Process";
    }
}

app.post("/getscores", async function (req, res) {
    console.log("Reached Here: Got Request");
    let exitMessage = await getMarks(homeURL, req.body.username, req.body.password, req.body.semester);
    console.log(exitMessage);
    res.send(sentData);
});

app.listen(PORT, async function () {
    console.log("The server is now listening on port", PORT);
    browser = await puppeteer.launch();
    newPage = await browser.newPage();
    console.log("Reached Here: Browser Open");
}).setTimeout(600000);