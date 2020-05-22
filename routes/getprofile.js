const express = require('express');
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
    await newPage.waitForNavigation();
    console.log("Reached Here: Result Page Reached");
    await newPage.goto(ProfileSection);
    console.log("Reached Here: Reached Profile Section");
    return 0;
}

async function getProfile(username, password) {
    await newPage.setDefaultNavigationTimeout(0);
    newPage.setViewport({ width: 1920, height: 1080 });
    await newPage.goto(homeURL);
    console.log("Reached Here: Reached the page");
    let loginStatus = await login(username, password);
    const arrayDetails = ["#ContentPlaceHolder1_txtApplicationNumber", "#ContentPlaceHolder1_txtNameAs12MarkCard", "#ContentPlaceHolder1_txtDOJClassStartdate", "#ContentPlaceHolder1_txtProgramBranch", "#ContentPlaceHolder1_txtDOB", "#ContentPlaceHolder1_txtGender", "#ContentPlaceHolder1_txtStudentEmailID", "#ContentPlaceHolder1_txtBloodGroup", "#ContentPlaceHolder1_txtCategoryofAdmission", "#ContentPlaceHolder1_txtNationality", "#ContentPlaceHolder1_txtReligion", "#ContentPlaceHolder1_txtDomicileState"];
    const arrayDescription = ["registrationNumber", "name", "dateOfJoining", "branch", "dateOfBirth", "gender", "email", "bloodGroup", "admissionCategory", "nationality", "religion", "domicileState"];
    for (let iterateArray = 0; iterateArray < arrayDescription.length; iterateArray++) {
        let detail = arrayDetails[iterateArray];
        let tempKey = arrayDescription[iterateArray];
        let tempValue = await newPage.evaluate(el => el.value, await newPage.$(`${detail}`));
        //adding the key value pair to the object 'profileObj'
        profileObj[tempKey] = tempValue.toLowerCase();;
    }
}
router.get("/getprofile", async function (req, res) {
    console.log("Reached Here: Got Request for profile");
    let exitMessage = await getProfile(req.query.username, req.query.password);
    res.send(profileObj);
});

router.post("/getprofile", async function (req, res) {
    console.log("Reached Here: Got Request for profile");
    let exitMessage = await getProfile(req.body.username, req.body.password);
    res.send(profileObj);
});

module.exports = router;