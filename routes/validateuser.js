var express = require('express');
var router = express.Router();

let USERNameBox = "#txtUserid";
let USERPassBox = "#txtpassword";
let LoginValidator = "#btnLogin";
let homeURL = "https://slcm.manipal.edu/loginForm.aspx";

async function validate(usernameCheck, passwordCheck) {
    // await newPage.setDefaultNavigationTimeout(4000);
    newPage.setViewport({ width: 1920, height: 1080 });
    await newPage.goto(homeURL);
    console.log("Reached Here: Reached the page");
    await newPage.click(USERNameBox);
    await newPage.keyboard.type(usernameCheck);
    console.log("Reached Here: Entered Username");
    await newPage.click(USERPassBox);
    await newPage.keyboard.type(passwordCheck);
    console.log("Reached Here: Entered Password");
    await newPage.click(LoginValidator);
    console.log("Reached Here: Clicked Login");
    try {
        await newPage.waitForSelector('#rtpchkMenu_lnkbtn2_0', { timeout: 2500 });
        console.log("Reached Here: Login Successful");
        return "loginSuccess";
    }
    catch (err) {
        console.log("Not Logging");
        return "loginError";
    }
}

router.get("/validateuser", async function (req, res) {
    console.log("Reached Here: Got Request for validation");
    testUsername = req.query.username;
    testPassword = req.query.password;
    let authorization = await validate(testUsername, testPassword);
    if (authorization == "loginSuccess") {
        console.log("Correct Credentials");
        let responseValidation = { credentialsValid: true };
        let checkCredentials = responseValidation;
        res.send(checkCredentials);
    }
    else if (authorization == "loginError") {
        console.log("Incorrect Credentials");
        let responseValidation = { credentialsValid: false };
        let checkCredentials = responseValidation;
        res.send(checkCredentials);
    }
});

router.post("/validateuser", async function (req, res) {
    console.log("Reached Here: Got Request for validation");
    testUsername = req.body.username;
    testPassword = req.body.password;
    let authorization = await validate(testUsername, testPassword);
    if (authorization == "loginSuccess") {
        console.log("Correct Credentials");
        let responseValidation = { credentialsValid: true };
        let checkCredentials = responseValidation;
        res.send(checkCredentials);
    }
    else if (authorization == "loginError") {
        console.log("Incorrect Credentials");
        let responseValidation = { credentialsValid: false };
        let checkCredentials = responseValidation;
        res.send(checkCredentials);
    }
});

module.exports = router;