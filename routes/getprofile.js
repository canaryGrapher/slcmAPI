const express = require('express');
const axios = require('axios');
const router = express.Router();

//variables required by the program
let USERNameBox = "#txtUserid";
let USERPassBox = "#txtpassword";
let LoginValidator = "#btnLogin";
let ProfileSection = "https://slcm.manipal.edu/StudentProfile.aspx";
let homeURL = "https://slcm.manipal.edu/loginForm.aspx";
profileObj = {};

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
    await newPage.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log("Reached Here: Result Page Reached");
    await newPage.goto(ProfileSection);
    console.log("Reached Here: Reached Profile Section");
    return "loginSuccess";
}

async function getProfile(username, password) {
    await newPage.setDefaultNavigationTimeout(10000);
    newPage.setViewport({ width: 1920, height: 1080 });
    try {
        await newPage.goto(homeURL);
        console.log("Reached Here: Reached the page");
        await login(username, password);
        const arrayDetails = ["#ContentPlaceHolder1_txtApplicationNumber", "#ContentPlaceHolder1_txtNameAs12MarkCard", "#ContentPlaceHolder1_txtDOJClassStartdate", "#ContentPlaceHolder1_txtProgramBranch", "#ContentPlaceHolder1_txtDOB", "#ContentPlaceHolder1_txtGender", "#ContentPlaceHolder1_txtStudentEmailID", "#ContentPlaceHolder1_txtBloodGroup", "#ContentPlaceHolder1_txtCategoryofAdmission", "#ContentPlaceHolder1_txtNationality", "#ContentPlaceHolder1_txtReligion", "#ContentPlaceHolder1_txtDomicileState"];
        const arrayDescription = ["regNo", "name", "dateOfJoining", "branch", "dob", "gender", "email", "bloodGroup", "admissionCategory", "nationality", "religion", "domicileState"];
        for (let iterateArray = 0; iterateArray < arrayDescription.length; iterateArray++) {
            let detail = arrayDetails[iterateArray];
            let tempKey = arrayDescription[iterateArray];
            let tempValue = await newPage.evaluate(el => el.value, await newPage.$(`${detail}`));
            //adding the key value pair to the object 'profileObj'
            profileObj[tempKey] = tempValue.toLowerCase();;
        }
        return ["requestSuccess", "The request was completed successfully"];
    }
    catch (errorServer) {
        console.log(errorServer);
        console.log("There is an error");
        return ["serverError", "ERROR: It is either us, or SLcM is being a bitch. No hard feelings."];
    }

}

router.get("/getprofile", async function (req, res) {
    console.log("Reached Here: Got Request for profile");
    if (req.body.novalidate == "true") {
        let exitMessage = await getProfile(req.query.username, req.query.password);
        if (exitMessage[0] == "serverError") {
            res.send(exitMessage[1]);
        }
        else {
            res.send(profileObj);
        }
    }
    else if (req.query.novalidate == "false") {
        axios.get(`http://localhost:${PORT}/validateuser?username=${req.query.username}&password=${req.query.password}`).then(async response => {
            let testCredentials = response.data;
            if (testCredentials.credentialsValid == true) {
                console.log("Login SuccessFull");
                let exitMessage = await getProfile(req.query.username, req.query.password);
                if (exitMessage[0] == "serverError") {
                    res.send(exitMessage[1]);
                }
                else {
                    res.send(profileObj);
                }
            }
            else {
                console.log("Login Unsuccessful");
                res.send("Invalid Credentials were provided");
            }
        }).catch(error => {
            console.log(error);
            res.send("There is a problem with the server. Please try again after some time");
        });
    }
});

router.post("/getprofile", async function (req, res) {
    console.log("Reached Here: Got Request for profile");
    if (req.body.novalidate == "true") {
        let exitMessage = await getProfile(req.body.username, req.body.password);
        if (exitMessage[0] == "serverError") {
            res.send(exitMessage[1]);
        }
        else {
            res.send(profileObj);
        }
    }
    else if (req.body.novalidate == "false") {
        axios.get(`http://localhost:${PORT}/validateuser?username=${req.body.username}&password=${req.body.password}`).then(async response => {
            let testCredentials = response.data;
            if (testCredentials.credentialsValid == true) {
                console.log("Login SuccessFull");
                let exitMessage = await getProfile(req.body.username, req.body.password);
                if (exitMessage[0] == "serverError") {
                    res.send(exitMessage[1]);
                }
                else {
                    res.send(profileObj);
                }
            }
            else {
                console.log("Login Unsuccessful");
                res.send("Invalid Credentials were provided");
            }
        }).catch(error => {
            console.log(error);
            res.send("There is a problem with the server. Please try again after some time");
        });
    }
});

module.exports = router;