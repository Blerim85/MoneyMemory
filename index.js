const express = require("express");
const bp = require("body-parser");
const fs = require("fs");
const session = require("express-session");
const json2csv = require('json2csv');
// const bcrypt = require("bcrypt");
const handlebars = require("express-handlebars");
const path = require("path");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const moment = require("moment-timezone");
// const nodemailer = require("nodemailer");
const controller = require("./views/controller");

const app = express(); 
const server = app.listen(5060, () => {
    console.log("Server für EA-MVC läuft.");
});

app.use(bp.urlencoded({extended:false}));
app.use(session({secret:"ruhe", saveUninitialized: true,resave: true}));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine("hbs", handlebars({defaultLayout: "index", extname: "hbs"}));
app.use(express.static("views"));
// let logStream = fs.createWriteStream("./views/logs/stat.log", {flags:"a"});
let logStream = rfs.createStream("stat.log", {
    interval: "1d",
    path:"./views/logs"
});

morgan.token("date", (req, res, tz) => {
    return moment().tz(tz).format();
});
app.use(morgan(":url - :method - :status - :response-time ms - [:date[Austria]]", {stream:logStream}));

//app.use("/static", static);

// GET login page
app.get("/login", controller.openLoginPage); 

// GET logout
app.get("/logout", controller.userLogout); 

// GET MAIN
app.get("/main", controller.getMainPage); 

// GET request registrierung
app.get("/register", controller.getRegisterPage); 

// POST REQUEST LOGIN
app.post("/login", controller.userLogin);

// POST REQUEST REGISTRIERUNG
app.post("/register", controller.userRegister);

// DELETE request
app.post("/userdelete", controller.userDelete); 

// CALCULATE REQUEST 
app.post("/calc", controller.calculationProcess);

// CALCULATE DELETE
app.get("/contentdelete/:id", controller.deleteProcess); 

// GET PASSWORD CHANGE PAGE
app.get("/forgetpass", controller.forgotPassword); 

// POST EMAIL FOR PASS CHANGE
app.post("/forgetpass", controller.sendMail4reset); 

// GET TO DOWLOAD ALL
app.get("/getfile", controller.getAll);

// POST GETFILE TO DOWNLOAD
app.post("/getfile", controller.downloadFile);

// CHANGE NEW PASS PAGE GET REQUEST
app.get("/changepass", controller.changePassPage);

// CHANGE NEW PASS POST REQUEST
app.post("/changepass", controller.changePassword);

// POST DELETE YEAR MONTH
app.post("/yearmonth", controller.deleteYearMonth);










