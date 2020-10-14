const express = require("express");
const bp = require("body-parser");
const nodemailer = require("nodemailer");
const json2csv = require("json2csv");
const validator = require("email-validator");
const model = require("./model.js");
const view = require("./view.js");
const app = express();

app.use(bp.urlencoded({extended:false}));
// app.use(session({secret:"ruhe", saveUninitialized: true,resave: true}));
let sess;

let MVCcontroller = {
    // To load the first page, login page
    openLoginPage: (request, response) => {
        sess = request.session;
        console.log("openloginpage IN ctrl");

        if (sess.auth) {
            response.render("main", {layout: "index"});
        } else {
            response.render("login", {
                layout: "index",
            });
        }
    },
    // To log out user
    userLogout: (request, response) => {
        sess = request.session;
        console.log("logout request IN ctrl");

        if (sess.auth) {
            sess.auth = false;
            response.render("login", {layout: "index"});
        } else {
            console.log("session ist false");
        }
    },
    // To load the Main page of the Calculator
    getMainPage: (request, response) => {
        sess = request.session;
        console.log("getmainpage request IN ctrl");
    
        if (sess.auth) {

            model.readContent(sess.userid, (cb) => {

                let tableContentEin = cb.content.filter(el => el.rechnung == "ein");
                let tableContentAus = cb.content.filter(el => el.rechnung == "aus");

                let alleEin = cb.totalEin;
                let alleAus = cb.totalAus;
                let totalAmount = cb.total;
                let taxEin = cb.taxtotalEin;
                let taxAus = cb.taxtotalAus;
                let currentuser = sess.name;

                function sortNumbers(a, b) {
                    return b.datenum - a.datenum;
                }

                tableContentEin.sort(sortNumbers);
                tableContentAus.sort(sortNumbers);

                let plusminus;
                // let minus;

                if (totalAmount >= 0) {
                    plusminus = "stand_style_plus";
                } else {
                    plusminus = "stand_style_minus";
                }

                response.render("main", {
                    layout: "index",
                    tableContentEin,
                    tableContentAus,
                    totalAmount,
                    alleEin,
                    alleAus,
                    taxEin,
                    taxAus,
                    currentuser,
                    plusminus
                });
            });
        } else {
            response.render("login", {layout: "index"});
        }
    },
    // To load the Register Page
    getRegisterPage: (request, response) => {
        sess = request.session;
        console.log("getregisterpage request IN ctrl");

       if (sess.auth) {
           response.render("main", {layout: "index"});
       } else {
            response.render("registrierung", {
                layout: "index",
            });
       }
    },
    // User Loging In
    userLogin: (request, response ) => {
        sess = request.session;
        console.log("userlogin request IN ctrl");

        let newUserLog = {
            email: request.body.email,
            pwd: request.body.pwd
        }
        model.getUser(newUserLog, (getUserLogin) => {

            if (getUserLogin.status == "err") {

                response.render("login", {
                    layout: "index",
                    errorValidationLogin: true
                });
            } else {
                sess.auth = true;
                sess.userid = getUserLogin.userid;
                sess.name = getUserLogin.name;
                console.log(sess.userid);

                response.redirect("/main");
            }
        });
    },
    // User Registering
    userRegister: (request, response ) => {
        console.log("userregister IN ctrl");

        let newUserReg = {
            email: request.body.email,
            pwd: request.body.pwd,
            pwdCopy: request.body.pwdCopy
        }

        if (newUserReg.pwd === newUserReg.pwdCopy && validator.validate(newUserReg.email) && newUserReg.pwd.length >= 8) {

            model.saveUser(newUserReg, (getUserRegister) => {
 
                if (getUserRegister.status == "err") {
                    
                    response.render("registrierung", {
                        layout: "index",
                        errorValidationRegister: true
                    });
                }

                response.render("message", {
                    layout: "index",
                    messageOk: true
                });
            });

        } else {
            response.render("registrierung", {
                layout: "index",
                errorValidationRegister: true
            });
        }
    },
    // User Deleting Account
    userDelete: (request, response ) => {
        sess = request.session;
        console.log("userdelete request IN ctrl");

        model.deleteUser(sess.userid, (getUserDelete) => {

            if (getUserDelete.status == "ok") {
                let htmlContent = view.deleteSuccess();
                sess.auth = false;
                response.status(200).end(htmlContent);
            } else {
                sess.auth = true;
                response.render("main", {
                    layout: "index",
                    errorValidationDelete: true
                });
            }
        });
    },
    // Taking inputs to the calculation process
    calculationProcess: (request, response) => {
        sess = request.session;
        
        let inputFields = {
            rechnung: request.body.rechnung,
            mwst: request.body.mwst,
            datum: request.body.datum,
            beschreibung: request.body.beschreibung,
            euro: request.body.euro
        }

        model.writeContent(inputFields, sess.userid, (callback) => {
            console.log("calc pro tablecontent IN");

            if (callback.status == "err") {
                response.render("main", {
                    layout: "index",
                    datenError: true
                });
            } else {
                response.redirect("/main");
            }
        });
    },
    // To delete content Line
    deleteProcess: (request, response) => {
        console.log("deleteprocess IN");
        sess = request.session;       
        let idParam = request.params.id;

        model.deleteContent(sess.userid, idParam, (callback) => {
            
            if (callback.status == "ok") {
               response.redirect("/main");
            } else {
                response.render("main", {
                    layout: "index",
                    dataErrorMessage
                });
            }
        });
    },
    // Take email to reset a random passwort for - Forgot Password -
    sendMail4reset: (request,response) => {
        console.log("send4mailreset IN ctrl");
        sess = request.session;
        let emailInput = request.body.email;

        model.resetingPassword(sess.userid, emailInput, (callback) => {
            let htmlErrorMail = view.errorMailMessage();

            if (callback === "NoUser") {
                response.status(200).end(htmlErrorMail);
            } else {
                var transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                    user: "webdevelopmenttool4coding@gmail.com",
                    pass: "chicken4free"
                    }
                });
                
                var mailOptions = {
                    from: "webdevelopmenttool4coding@gmail.com",
                    to: emailInput, 
                    subject: "Password change",
                    text: "Dein Passwort",
                    html: `<h2>Dein neuer Passwort: <b>${callback}</b></h2>`
                };

                transporter.sendMail(mailOptions, (error, success) => {
                    // console.log(error);
                    if (!error) {
                        let html4SuccesMail = view.openMailMessage();
                        response.status(200).end(html4SuccesMail);
                    } else {                       
                        response.status(200).end(htmlErrorMail);
                    }
                });
            }
        });
    },
    // To get the Page for - Forgot Password -
    forgotPassword: (request, response) => {
        let passChangeHtml = view.content4pass();
        response.status(200).end(passChangeHtml);
    },
    // Calculating and downloading year or month requested
    downloadFile: (request, response) => {
        sess = request.session;
        let formonat = request.body.formonat;
        let forjahr = request.body.forjahr;
        let jahr = request.body.jahr;

        model.getFileFromDatabase(sess.userid, (convertedData) => {

            let yearToBePrinted = convertedData.content.filter(el => el.jahr === parseInt(jahr) || el.jahr === parseInt(forjahr) && el.monat === parseInt(formonat));

            function toFix( value, dp ){
                return +parseFloat(value).toFixed( dp );
            }
           
            let onerow = yearToBePrinted.map(el => el = {
                Rechnung: el.rechnung,
                Datum: el.datum,
                Beschreibung: el.beschreibung,
                Steuer: el.mwst,
                Steuerbetrag: el.taxamount,
                Betrag: el.euro
            });

            onerow.sort((a,b) => {
                let d1 = a.Datum.split('-');
                let d2 = b.Datum.split('-');

                d1 = d1[2] + '-' + d1[1] + '-' + d1[0];
                d2 = d2[2] + '-' + d2[1] + '-' + d2[0];
                return d1 < d2 ? 1 : -1;
            });

            let eurosIn = onerow.map(el => el.Rechnung == "ein" ? el.Betrag : 0);
            let eurosOut = onerow.map(el => el.Rechnung == "aus" ? el.Betrag : 0);
            let taxIn = onerow.map(el => el.Rechnung == "ein" ? el.Steuerbetrag : 0);
            let taxOut = onerow.map(el => el.Rechnung == "aus" ? el.Steuerbetrag : 0);

            let calc = (sum) => {
                let x = sum.reduce(function(a, b) {
                    return a + b;
                }, 0);
                return x;
            }

            let allData = {
                rows: onerow,
                totalIn: calc(eurosIn),
                totalOut: calc(eurosOut),
                taxIn: calc(taxIn),
                taxOut: calc(taxOut),
                total: calc(eurosIn) - calc(eurosOut)
            }
            let allInOne = {
                Einnahmen: toFix(allData.totalIn, 2),
                Ausgaben: toFix(allData.totalOut, 2),
                Ust: toFix(allData.taxIn, 2),
                Vst: toFix(allData.taxOut, 2),
                Summe: toFix(allData.total, 2)
            }

            let toPrint = allData.rows;
            toPrint.push(allInOne);

            const json2csvParser = new json2csv.Parser({delimiter: ";"});
            const csv = json2csvParser.parse(toPrint);
            // view.closeModal();
            response.attachment(`inhalt.${forjahr||jahr}-${formonat||0}.csv`);

            response.status(200).send(csv);
        });
    },
    // Get all content dowloaded
    getAll: (request, response) => {
        sess = request.session;

        model.getFileFromDatabase(sess.userid, (data) => {
            
            function toFix( value, dp ){
                return +parseFloat(value).toFixed( dp );
            }

            let insideContent = data.content.map(el => el = {
                Rechnung: el.rechnung,
                Datum: el.datum,
                Beschreibung: el.beschreibung,
                Steuer: el.mwst,
                Steuerbetrag: el.taxamount,
                Betrag: el.euro
            });

            insideContent.sort((a,b) => {
                let d1 = a.Datum.split('-');
                let d2 = b.Datum.split('-');

                d1 = d1[2] + '-' + d1[1] + '-' + d1[0];
                d2 = d2[2] + '-' + d2[1] + '-' + d2[0];
                return d1 < d2 ? 1 : -1;
            });

            let allData = {
                rows: insideContent,
                totalIn: data.totalEin,
                totalOut: data.totalAus,
                taxIn: data.taxtotalEin,
                taxOut:  data.taxtotalAus,
                total: data.total
            }

            let allTotals = {
                Einnahmen: toFix(data.totalEin, 2),
                Ausgaben: toFix(data.totalAus, 2),
                Ust: toFix(data.taxtotalEin, 2),
                Vst: toFix(data.taxtotalAus, 2),
                Summe: toFix(data.total, 2)
            }
            let toPrint = allData.rows;
            toPrint.push(allTotals);

            const json2csvParser = new json2csv.Parser({delimiter: ";"});
            const csv = json2csvParser.parse(toPrint);
            response.attachment(`inhalt.gesamt.csv`);

            response.status(200).send(csv);
        });
    },
    // Get Page to change your password
    changePassPage: (request, response) => {
        let htmlPassChange = view.viewPassChange();
        response.status(200).end(htmlPassChange);
    },
    // Changing your password
    changePassword: (request, response) => {
        sess = request.session;

        let inputPasswords = {
            passone: request.body.passwordone,
            passtwo: request.body.passwordtwo,
            passthree: request.body.passwordthree
        }
        
        if (inputPasswords.passtwo != inputPasswords.passthree) {
            let passesNotSame = view.passNotSameErrorMessage();
            response.status(200).end(passesNotSame);
        } else {
            model.resetPassInModel(sess.userid, inputPasswords, (callback) => {

                if (sess.auth) {
                    console.log("password changed");
                    response.redirect("/main");
                } else {
                    response.redirect("/login");
                }
            });
        }
    },
    // Deleting whole month or year when requested
    deleteYearMonth: (request, response) => {
        console.log("deleteyearmonth IN ctrl");
        sess = request.session;       
        let idParam = request.params.id;
        let monthyearinput = {
            deletemonth: parseInt(request.body.delmonat),
            deleteyear: parseInt(request.body.deljahr)
        }

        model.deleteYearMonthModel(sess.userid, idParam, monthyearinput, (callback) => {
            
            if (callback.status == "ok") {
               response.redirect("/main");
            } else {
                response.render("main", {
                    layout: "index",
                    dataErrorMessage
                });
            }
        });
    }
}
module.exports = MVCcontroller;












