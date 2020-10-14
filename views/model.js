const express = require("express");
const bp = require("body-parser");
const fs = require("fs");
const Event = require("events");
const session = require("express-session");
const bcrypt = require("bcrypt");
const app = express();
app.use(express.static("views"));
app.use(bp.urlencoded({extended:false}));
app.use(session({secret:"ruhe", saveUninitialized: true,resave: true}));
class AllEvents extends Event {
    constructor() {
        super();
    }
}
// GLOBALE VARIABLEN
let userevents = new AllEvents();
// let sess;
const saltRounds = 10;
///// LOGIN REGISTER PART
// READ DATA
userevents.on("readjson", (callback) => {
    fs.readFile(__dirname + "/model/database.json", (error,content) => {
        if (!error) {
            // userevents.emit("readingfinished");
            callback(JSON.parse(content));
        } else {
            console.log("readjson error");
        }
    });
});
/*
userevents.on("readingfinished", () => {
    console.log("readjson einlesen fertig");
});
*/
// WRITE DATA
userevents.on("writejson", (newdata, callback) => {   
    fs.writeFile(__dirname + "/model/database.json", JSON.stringify(newdata), (error) => {
        if(!error) {
            // userevents.emit("writingfinished");
            callback("registerOK");
        } else {
            console.log("writejson error");
            callback("registerError");
        }
    });
});
/*
userevents.on("writingfinished", () => {
    console.log("writejson, speichern der daten fertig");
});
*/
// ADD ID
userevents.on("getuserid", (callback) => {
    userevents.emit("readjson", (userdata) => {
        callback(userdata.userid);
    });
});
// READ USER
userevents.on("readuser", (newuser, callback) => {
    userevents.emit("readjson", (userdata) => {

        let userLogin = userdata.data.filter((el) => {
            return el.email === newuser.email;
        }); 

        if (userLogin.length === 0) {
            callback("loginError");
        } else {
            bcrypt.compare(newuser.pwd, userLogin[0].pwd, (error, result) => {
                
                if (result) {
                    userevents.emit("readuserdone");
                    callback(userLogin[0]);
                } else {
                    console.log("compare error message");
                    callback("loginError");
                }
            });
        }
    });
});
userevents.on("readuserdone", (callback) => {
    console.log("readuser/readuserdone ist fertig");
});
// ADD USER
userevents.on("adduser", (newuser, callback) => {
    userevents.emit("readjson", (userdata) => {    
        
        let userFilter = userdata.data.filter(el => el.email == newuser.email);

        if (userFilter.length > 0) {
            console.log("error - user gibts bereits");
            callback("registerError");
        } else { 
            userevents.emit("getuserid", (userid) => {

                userdata.userid = newuser.id = userid + 1;     
                
                bcrypt.genSalt(saltRounds, (error, salt) => {
                    if (error) {
                        console.log("error beim gensalt adduser");
                    }
                    bcrypt.hash(newuser.pwd, salt, (error, hash) => {
                        if(error) {
                            console.log("error bcrypt adduser");
                            callback("registerError");
                        } else {
                            newuser = {
                                email: newuser.email,
                                pwd: hash,
                                id: newuser.id
                            }

                            userdata.data.push(newuser);

                            userevents.emit("writejson", userdata,() => {
                                userevents.emit("writecontent", {content:[],mainid:0,totalEin:0,totalAus:0,total:0,taxtotalEin:0,taxtotalAus:0}, newuser.id, () => {
                                    callback("registerOK");
                                });
                            });
                        }
                    });
                });
            });
        }
    });
});
// DELETE USER
userevents.on("deletedata", (id, callback) => {
    userevents.emit("readjson", (userdata) => {   
        userevents.emit("readcontent", id, (content) => {

        content = {
            content: [],
            mainid: 0,
            totalEin: 0,
            totalAus: 0,
            total: 0,
            taxtotalEin: 0,
            taxtotalAus: 0
        }

        userdata.data = userdata.data.filter(el => el.id != id);
        //userdata.userid--;

        userevents.emit("writecontent", content, id, callback);
        userevents.emit("writejson", userdata, callback);
        });
    });
});
//// CALCULATION PART
// READ CONTENT
userevents.on("readcontent", (userid, callback) => {
    fs.readFile(__dirname + "/model/content." + userid + ".json", (error,content) => {
        if (!error) {
            // userevents.emit("readingcontent");
            callback(JSON.parse(content));
        } else {
            console.log("readcontent error");  
        }
    });
});
/*
userevents.on("readingcontent", () => {
    console.log("reading content fertig");
});
*/
// WRITE CONTENT
userevents.on("writecontent", (newdata, userid, callback) => {   
    fs.writeFile(__dirname + "/model/content." + userid + ".json", JSON.stringify(newdata), (error) => {
        if(!error) {
            // userevents.emit("writingcontent");
            callback("writingOK");
        } else {
            console.log("writecontent error");
            callback("writingError");
        }
    });
});
/*
userevents.on("writingcontent", () => {
    console.log("writing content fertig");
});
*/
// ADD CONTENT
userevents.on("addcontent", (contentObj, userid, callback) => {
    userevents.emit("readcontent", userid, (contentdata) => {
        userevents.emit("getcontentid", userid, (mainid) => {

            contentdata.mainid = contentObj.id = mainid + 1;

            function toFix( value, dp ){
                return +parseFloat(value).toFixed( dp );
            }
            
            let dateDay = contentObj.datum.split("-");
            let day = dateDay[2];
            let dateMonth = contentObj.datum.split("-");
            let month = dateMonth[1];
            let dateYear = contentObj.datum.split("-");
            let year = dateYear[0];
            let dateAsInt = parseInt(`${year}${month}${day}`);
            let fixedDate = day + "-" + month + "-" + year;

            contentObj = {
                rechnung: contentObj.rechnung,
                mwst: parseFloat(contentObj.mwst),
                taxamount: contentObj.taxamount,
                datum: fixedDate,
                tag: parseInt(day),
                monat: parseInt(month),
                jahr: parseInt(year),
                datenum: dateAsInt,
                beschreibung: contentObj.beschreibung,
                euro: parseFloat(contentObj.euro),
                id: contentObj.id
            }

            contentObj.taxamount = toFix((contentObj.euro * contentObj.mwst / 100), 2);

            if (contentObj.rechnung == "ein") {
                contentdata.totalEin = toFix(contentdata.totalEin + contentObj.euro, 2);
                contentdata.taxtotalEin = toFix(contentdata.taxtotalEin + contentObj.taxamount, 2); 
                contentdata.totalEin = toFix(contentdata.totalEin, 2);
                contentdata.taxtotalEin = toFix(contentdata.taxtotalEin, 2);
            } else {
                contentdata.totalAus = toFix(contentdata.totalAus + contentObj.euro, 2);
                contentdata.taxtotalAus = toFix(contentdata.taxtotalAus + contentObj.taxamount, 2); 
                contentdata.totalAus = toFix(contentdata.totalAus, 2);
                contentdata.taxtotalAus = toFix(contentdata.taxtotalAus, 2);
            }
            
            contentdata.total = toFix(contentdata.totalEin - contentdata.totalAus, 2);

            contentdata.content.push(contentObj);

            userevents.emit("writecontent", contentdata, userid, () => {
                callback("writingOK");
            });
        });
    });
});
/*
// READ SELECTED CONTENT
userevents.on("readselectedcontent", (newcontent, callback) => {
    console.log("readselectedcontent 1 IN m");

    userevents.emit("readcontent", (data) => {
        let selectedObj = data.content.map((el) => {
            return el.id;
        }); 
        callback(selectedObj[0]);
    });
});
*/
// GET CONTENT ID
userevents.on("getcontentid", (userid, callback) => {
    userevents.emit("readcontent", userid, (content) => {
        callback(content.mainid);
    });
});
// DELETE CONTENT
userevents.on("deletecontent", (sessid, idParam, callback) => {
    userevents.emit("readcontent", sessid, (usercontent) => {   
        function toFix(value, dp){
            return +parseFloat(value).toFixed(dp);
        }
 
        let euroValueInContentObj = usercontent.content.find(el => el.id == idParam ? el.euro:null);
        let taxamountValueInContentObj = usercontent.content.find(el => el.id == idParam ? el.taxamount:0);
        let rechnungInContentObj = usercontent.content.find(el => el.id == idParam ? el.rechnung:null);
        let euro_ = toFix(euroValueInContentObj.euro, 2);
        let taxamount_;
        if (taxamountValueInContentObj === undefined) {
            taxamount_ = 0;
        } else {
            taxamount_ = toFix(taxamountValueInContentObj.taxamount, 2);
        }
        let totaltax_ = toFix(usercontent.taxtotalEin - taxamount_, 2);

        if (rechnungInContentObj.rechnung == "ein") {
            usercontent.total = toFix(usercontent.total - euro_, 2);
            usercontent.totalEin = toFix(usercontent.totalEin - euro_, 2);
            usercontent.taxtotalEin = toFix(totaltax_, 2);
        } else {
            usercontent.total = toFix(usercontent.total + euro_, 2);
            usercontent.totalAus = toFix(usercontent.totalAus - euro_, 2);
            usercontent.taxtotalAus = toFix(usercontent.taxtotalAus - taxamount_, 2);
        }

        usercontent.content = usercontent.content.filter(el => el.id != idParam);
        // userdata.userid--;
        userevents.emit("writecontent", usercontent, sessid, callback);
    });
});
// PASSWORD RESET WITH EMAIL
userevents.on("resetpassword", (sessid, useremail, callback) => {
    userevents.emit("readjson", (userdata) => {

        let userLoginEmail = userdata.data.filter((el) => {
            return el.email === useremail;
        }); 

        if (userLoginEmail.length === 0) {
            console.log("if userloginemail empty error IN");
            callback("NoUser");
        } else {
            userdata.data = userdata.data.filter(el => el.email != useremail);

            let randomPass = Math.floor(100000000 + Math.random() * 800000000);

            bcrypt.genSalt(saltRounds, (error, salt) => {
                if (error) {
                    console.log("error beim gensalt adduser");
                }
                bcrypt.hash(randomPass.toString(), salt, (error, hash) => {
                    if(error) {
                        console.log("error bcrypt adduser");
                        callback("registerError");
                    } else {
                        userLoginEmail = {
                            email: userLoginEmail[0].email,
                            pwd: hash,
                            id : userLoginEmail[0].id
                        }

                        userdata.data.push(userLoginEmail);

                        userevents.emit("writejson", userdata, callback);
                    }
                });
            });
            callback(randomPass);
        }
    });
});
// NEW PASSWORD
userevents.on("resetingnewpasswort", (sessid, inputs, callback) => {
    userevents.emit("readjson", (content) => {

        let userToBeReset = content.data.filter((el) => {
            return el.id === sessid;
        }); 

        bcrypt.compare(inputs.passone, userToBeReset[0].pwd, (error, result) => {
                
            if (result) {
                bcrypt.genSalt(saltRounds, (error, salt) => {
                    if (error) {
                        console.log("error beim gensalt adduser");
                    }
                    bcrypt.hash(inputs.passtwo, salt, (error, hash) => {
                        if(error) {
                            console.log("error bcrypt adduser");
                            callback("bcryptError");
                        } else {
                            content.data = content.data.filter(el => el.email != userToBeReset[0].email);

                            userWithNewPass = {
                                email: userToBeReset[0].email,
                                pwd: hash,
                                id : userToBeReset[0].id
                            }
        
                            content.data.push(userWithNewPass);
        
                            userevents.emit("writejson", content, callback);
                        }
                    });
                });
            } else {
                console.log("compare error message");
                callback("compareError");
            }
        });
    });
});
// DELETE YEARMONTH
userevents.on("deleteyearmonth", (sessid, idParam, myinput, callback) => {
    userevents.emit("readcontent", sessid, (usercontent) => {  

        let yearmonthObj = usercontent.content.filter(el => el.jahr === myinput.deleteyear && el.monat === myinput.deletemonth);

        let yearObj = usercontent.content.filter(el => el.jahr === myinput.deleteyear);

        let calc = (sum) => {
            let x = sum.reduce(function(a, b) {
                return a + b;
            }, 0);
            return x;
        }
        let toFix = (value, dp) => {
            return +parseFloat(value).toFixed(dp);
        }
        
        let deleteChosen = (chosen) => {
            let eurosIn = chosen.map(el => el.rechnung == "ein" ? el.euro : 0);
            let eurosOut = chosen.map(el => el.rechnung == "aus" ? el.euro : 0);
            let taxIn = chosen.map(el => el.rechnung == "ein" ? el.taxamount : 0);
            let taxOut = chosen.map(el => el.rechnung == "aus" ? el.taxamount : 0);
    
            usercontent.total = toFix((usercontent.total + calc(eurosOut)) - calc(eurosIn), 2);
            usercontent.totalEin = toFix(usercontent.totalEin - calc(eurosIn), 2);
            usercontent.taxtotalEin = toFix(usercontent.taxtotalEin - calc(taxIn), 2);
            usercontent.totalAus = toFix(usercontent.totalAus - calc(eurosOut), 2);
            usercontent.taxtotalAus = toFix(usercontent.taxtotalAus - calc(taxOut), 2);
            
            let ids_ = chosen.map(el => el.id);
            
            ids_.forEach(element => {
                usercontent.content = usercontent.content.filter(el => element != el.id);
            });
    
            // userdata.userid--;
            userevents.emit("writecontent", usercontent, sessid, callback);
        }

        if (isNaN(myinput.deletemonth)) {
            deleteChosen(yearObj);
        } else {
            deleteChosen(yearmonthObj);
        }
    });
});

let MVCmodel = {
    getUser: (newUserLog, callback) => {
        userevents.emit("readuser", newUserLog, (data) => {

            if(data == "loginError") {
                callback({
                    "status": "err", 
                    "content": "error"
                });
            } else {
                callback({
                "status": "ok",
                "content": "success",
                "name": data.email,
                "userid": data.id
                });
            }         
        });
    },
    saveUser: (newUserReg, callback) => {
        userevents.emit("adduser", newUserReg, (data) => {

            if(data == "registerError") {   
                callback({
                    "status":"err",
                    "content":"error"
                });
            } else {
                callback({
                    "status":"ok",
                    "content":"success"
                });
            }
        });
    },
    deleteUser: (userid, callback) => {
        userevents.emit("deletedata", userid, (data) => {

            if(data == "registerOK") {   
                callback({
                    "status":"ok",
                    "content":"success"
                });
            } else {
                callback({
                    "status":"err",
                    "content":"error"
                });
            }
        });
    },
    writeContent: (inputFields, userid, callback) => {
        userevents.emit("addcontent", inputFields, userid, (writingValidation) => {

            if (writingValidation == "writingError") {   
                callback({
                    "status":"err",
                    "content":"error"
                });
            } else {
                userevents.emit("readcontent", userid, (data) => {
                    callback({
                        "status":"ok",
                        "content":data.content
                    });
                });
            }
        });
    },
    deleteContent: (sessid, idParam, callback) => {
        userevents.emit("deletecontent", sessid, idParam, (cb) => {

            if(cb == "writingOK") {   
                callback({
                    "status":"ok",
                    "content":"success"
                });
            } else {
                callback({
                    "status":"err",
                    "content":"error"
                });
            }
        });
    },
    readContent: (userid, cb) => {
        userevents.emit("readcontent", userid, (data) => {
            cb(data);
        });
    },
    resetingPassword: (sessid, emailInput, callback) => {
        userevents.emit("resetpassword", sessid, emailInput, (passAndEmailObj) => {
            callback(passAndEmailObj);
        });
    },
    getFileFromDatabase: (sessid, callback) => {
        userevents.emit("readcontent", sessid, (content) => {
            callback(content);
        });
    },
    resetPassInModel: (sessid, inputPasswords, callback) => {
        userevents.emit("resetingnewpasswort", sessid, inputPasswords, (cb) => {
            if (cb == "passnotsame") {
                callback("passnotsame");
            } else {
                callback("resetOk");
            }
        });
    },
    deleteYearMonthModel: (sessid, idParam, myinput, callback) => {
        userevents.emit("deleteyearmonth", sessid, idParam, myinput, (cb) => {

            if(cb == "writingOK") {   
                callback({
                    "status":"ok",
                    "content":"success"
                });
            } else {
                callback({
                    "status":"err",
                    "content":"error"
                });
            }
        });
    }
}
module.exports = MVCmodel;








