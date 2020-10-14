var express = require("express");
var path = require("path");
var exphbs = require("express-handlebars");
var app = express();

app.set("view", path.join(__dirname, "view"));
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

let MVCview = {
    errorMessage: content => {
        return content;
    },
    loginMessage: () => {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
            <!-- Bootstrap CSS -->
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
            <link rel="stylesheet" type="text/css" href="./style/style.css">
            <title>Money Memory</title>
        </head>
        <body>
            
            <main>
            <!--
            <div class="col img-butt-div">
                <img src="../bilder/mm.png" alt="MM" id="mm">
            </div>
            -->
            <div class="container cont-main">
                <!--ROW (1-2) -->
                <div class="row firstrow">
                    <!--Neu + Modal-->
                    <!-- Button trigger modal-->

                    <div class="col-6">
                        <button type="button" class="btn add-new-data-button" data-toggle="modal" data-target="#exampleModalLong">
                            Neu +
                        </button>
                        
                        <!-- Modal -->
                        <div class="modal fade" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle"         aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h3 class="modal-title modal-style-title" id="exampleModalLongTitle">Money Memory</h3>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        <form id ="main-formular" class="cl-log-form" action="/calc" method="post">

                                            <div class="col-md2 mb-3 alle-felder">
                                                <label for="select" class="label-text">Rechnung</label>
                                                <select class="custom-select" name="rechnung" required>
                                                    <!--<option selected disabled value="">...</option>-->
                                                    <option class="option-text" value="ein" selected>Einnahmen</option>
                                                    <option class="option-text" value="aus">Ausgaben</option>
                                                </select>
                                                <div class="invalid-tooltip">
                                                    Bitte suchen Sie sich ein Feld aus.
                                                </div>
                                            </div>
                    
                                            <div class="col-md-6 mb-3 alle-felder" >
                                                <label for="date" class="label-text">Datum:</label>
                                                <input type="date" class="form-control form-control" name="datum" required>
                                            </div>
                                            
                                            <div class="col-md-6 mb-3 alle-felder">
                                                <label for="type" class="label-text">Beschreibung:</label>
                                                <input type="text" class="form-control form-control" name="beschreibung" required>
                                            </div>
                    
                                            <div class="col-md-3 mb-3 alle-felder">
                                                <label for="type" class="label-text">Euro:</label>
                                                <input type="text" class="form-control form-control" name="euro" required>
                                                <div class="invalid-tooltip">
                                                    Bitte geben Sie eine Zahl ein.
                                                </div>
                                            </div>
                                            
                                            <div class="modal-footer">
                                                <!--<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>-->
                                                <button type="submit" class="btn btn-primary btn-lg btn-block butt-submit-feld" id="button-save">Speichern</button>
                                            </div>
                                        
                                        </form>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <!--DropDown Logout button-->
                    <div class="col-6 dropdown">
                        <button class="btn btn-secondary dropdown-toggle dropdown-style-button" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Option
                        </button>
                        <div class="dropdown-menu dropdown-style-menu" aria-labelledby="dropdownMenuButton">
                            <form action="/logout" method="get">
                                <button class="dropdown-item"><span class="dropdown-style-logout">Auslogen</span></button>
                            </form>
                            <form action="/userdelete" method="post">
                                <button class="dropdown-item"><span clas="dropdown-style-delete">Konto löschen</span></button>
                            </form>
                        </div>
                    </div>
                </div>

                <!--ROW 3-->
                <div class="row thirdrow">
                    <div class="col">
                        <div class="output-div"><h3>+2500,00</h3></div>
                    </div>
                </div>
                {{#if errorValidationDelete}}
                    <h6 class="register_error">
                        Konto konnte nicht gelöscht werden!
                    </h6>
                {{/if}}
                {{#if datenError}}
                    <h6 class="register_error">
                        Daten konnten nicht geladen werden!
                    </h6>
                {{/if}}
                {{#if dataErrorMessage}}
                    <h6 class="register_error">
                        Daten konnten nicht gelöscht werden!
                    </h6>
                {{/if}}
                <!--ROW 4-->
                <div class="row fourthrow">
                    <div class="col-6 tabelle-einnahmen">
                        <h1 class="h1-table-einnahmen">Einnahmen</h1>
                        <table class="table table-striped ">
                            <!--class="all_tables ein_table"-->
                            <thead class="thead-dark">
                                <th scope="col">Nr</th>
                                <th scope="col">Datum</th>
                                <th scope="col">Rechnung</th>
                                <th scope="col">Wert</th>
                                <th scope="col" class="td_delete_icon">Löschen</th>
                            </thead>
                            <tbody class="all_tables">
                                {{#each tableContentEin}}
                                    <tr>
                                        <!--<th scope="row">{{this.nummer}}</th>-->
                                        <td>{{this.datum}}</td>
                                        <td class="td_style_einnahmen">{{this.beschreibung}}</td>
                                        <td class="td_style_euro_ein">{{this.euro}} €</td>
                                        <td class="td_delete_icon"><a href="/contentdelete" role="button" class="btn btn-outline-dark" method="get">X</a></td>
                                        <!--<td><i class="glyphicon glyphicon-remove">&#xe014;</i></td>-->
                                    </tr>
                                {{/each}}
                                {{#each tableCbEin}}
                                    <tr> 
                                        <!--<th scope="row">1</th>-->
                                        <td>{{this.datum}}</td>
                                        <td class="td_style_ausgaben">{{this.beschreibung}}</td>
                                        <td class="td_style_euro_aus">{{this.euro}} €</td>
                                        <td class="td_delete_icon"><a href="/contentdelete" role="button" class="btn btn-outline-dark">X</a></td>
                                    </tr>
                                {{/each}}
                            </tbody>
                        </table>
                    </div>
                    <div class="col-6 tabelle-ausgaben">
                        <h1 class="h1-table-ausgaben">Ausgaben</h1>
                        <table class="table table-striped">
                            <!-- class="all_tables aus_table"-->
                            <thead class="thead-dark">
                                <th scope="col">Nr</th>
                                <th scope="col">Datum</th>
                                <th scope="col">Rechnung</th>
                                <th scope="col">Wert</th>
                                <th scope="col" class="td_delete_icon">Löschen</th>
                            </thead>
                            <tbody class="all_tables">
                                {{#each tableContentAus}}
                                    <tr> 
                                        <!--<th scope="row">1</th>-->
                                        <td>{{this.datum}}</td>
                                        <td class="td_style_ausgaben">{{this.beschreibung}}</td>
                                        <td class="td_style_euro_aus">{{this.euro}} €</td>
                                        <td class="td_delete_icon"><a href="contentdelete" role="button" class="btn btn-outline-dark">X</a></td>
                                    </tr>
                                {{/each}} 
                                {{#each tableCbAus}}
                                    <tr> 
                                        <!--<th scope="row">1</th>-->
                                        <td>{{this.datum}}</td>
                                        <td class="td_style_ausgaben">{{this.beschreibung}}</td>
                                        <td class="td_style_euro_aus">{{this.euro}} €</td>
                                        <td class="td_delete_icon"><a href="contentdelete" role="button" class="btn btn-outline-dark">X</a></td>
                                    </tr>
                                {{/each}}
                            </tbody>
                        </table>
                    </div>
                </div>
                

                <!--ROW 5-->
                <div class="row fifthrow">
                    <Footer class="navbar fixed-bottom footer__style">
                        <i>Made by: Blerim Hasani</i>
                        <a href="impressum.html">Impressum</a>
                    </Footer>
                </div>

            </div>
            </main>

        
        
            <!-- jQuery first, then Popper.js, then Bootstrap JS -->
            <script src="./frames/jquery-3.5.1.min.js"></script>
            <script src="./frames/popper.min.js"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
            <script>
            window.history.pushState("", "", "/main");
            </script>
        </body>
        </html>`;
    },
    deleteSuccess: () => {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
            <!-- Bootstrap CSS -->
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
            <link rel="stylesheet" type="text/css" href="./style/style.css">
            <title>Money Memory</title>
        </head>
        <body>
        
            <div class="container col-xl-4 col-lg-6 col-md-6 col-sm-10 cont-log" >
                <form id="login-formular" class="cl-log-form" action="/login" method="post">
                    <img src="../bilder/mm.png" alt="MM" id="mm">
                    <p style="color:red">Konto wurde erfolreich gelöscht</p>
                    <div class="form-group">
                        <label for="email" class="label-text">Email:</label>
                        <input type="email" class="form-control border__style login-nutzer-falsch" id="input-benutzername" aria-describedby="emailHelp" name="email" autofocus>
                        <small id="emailHelp" class="form-text text-muted">Bitte geben Sie ihre Benutzername ein.</small>
                    </div>
                    <div class="form-group pass-div">
                        <label for="exampleInputPassword1" class="label-text">Passwort:</label>
                        <input type="password" class="form-control border__style login-pass-falsch" id="input-passwort" name="pwd">
                        <small id="emailHelp" class="form-text text-muted">Bitte geben Sie ihre Passwort ein.</small>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-lg btn-block butt-speichern" id="button-login">Einlogen</button>
                    <div class="form-group form-check reg-div">
                        <a href="/register" id="a-reg" method="get"><span class="reg-tag">Für Registrierung hier klicken!</span></a>
                        <div class="fehler-div" style="color:red"></div>
                    </div>
                    <div class="form-group form-check reg-div">
                    <a href="/forgetpass" method="get"><span class="reg-tag">Passwort vergessen!</span></a>
                    <div class="fehler-div" style="color:red"></div>
                  </div>
                </form>
            </div>
        
            <!-- jQuery first, then Popper.js, then Bootstrap JS -->
            <script src="./frames/jquery-3.5.1.min.js"></script>
            <script src="./frames/popper.min.js"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
            <script>
                window.history.pushState("", "", "/login");
            </script>
        </body>
        </html>`
    },
    openMailMessage: () => {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
            <!-- Bootstrap CSS -->
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
            <link rel="stylesheet" type="text/css" href="./style/style.css">
            <title>Money Memory</title>
        </head>
        <body>
        
            <div class="message_file">
                <h3>Neuer Passwort wurde zu ihre Email adresse geschickt!</h3>
                <a href="/login" id="a-reg" method="get"><span class="reg-tag">Für Login hier klicken!</span></a>
            </div>
        
            <!-- jQuery first, then Popper.js, then Bootstrap JS -->
            <script src="./frames/jquery-3.5.1.min.js"></script>
            <script src="./frames/popper.min.js"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
            <script>
                window.history.pushState("", "", "/login");
            </script>
        </body>
        </html>`
    },
    errorMailMessage :  () => {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
            <!-- Bootstrap CSS -->
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
            <link rel="stylesheet" type="text/css" href="./style/style.css">
            <title>Money Memory</title>
        </head>
        <body>
        
            <div class="message_file">
                <h3 style="color:red">Neuer Passwort konnte nicht erstellt werden!</h3>
                <br>
                <a href="/login" method="get"><span class="reg-tag">Für Login hier klicken!</span></a>
                <br>
                <br>
                <a href="/register" method="get"><span class="reg-tag">Für Registrierung hier klicken!</span></a>
            </div>
        
            <!-- jQuery first, then Popper.js, then Bootstrap JS -->
            <script src="./frames/jquery-3.5.1.min.js"></script>
            <script src="./frames/popper.min.js"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
            <script>
                window.history.pushState("", "", "/login");
            </script>
        </body>
        </html>`
    },
    content4pass: () => {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
            <!-- Bootstrap CSS -->
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
            <link rel="stylesheet" type="text/css" href="./style/style.css">
            <title>Money Memory</title>
        </head>
        <body>
        
        <div class="container col-xl-4 col-lg-6 col-md-6 col-sm-10 cont-log" >
        <form class="cl-log-form" action="/forgetpass" method="post">
          <img src="../bilder/mm.png" alt="MM" id="mm">
          <div class="form-group">
            <label for="email" class="label-text">Email:</label>
            <input type="email" class="form-control border__style login-nutzer-falsch" id="input-benutzername" aria-describedby="emailHelp" name="email" autofocus>
            <small id="emailHelp" class="form-text text-muted">Bitte geben Sie ihre Email ein.</small>
            </div>
      
            <button type="submit" class="btn btn-primary btn-lg btn-block butt-speichern">Senden</button>
          
            <div class="form-group form-check reg-div">
              <a href="/register" id="a-reg" method="get"><span class="reg-tag">Für Registrierung hier klicken!</span></a>
              <div class="fehler-div" style="color:red"></div>
            </div>
            <div class="form-group form-check reg-div">
                <a href="/login" id="a-reg" method="get"><span class="reg-tag">Zurück zur Login Seite!</span></a>
                <div class="fehler-div" style="color:red"></div>
            </div>
        </form>
      </div>
        
            <!-- jQuery first, then Popper.js, then Bootstrap JS -->
            <script src="./frames/jquery-3.5.1.min.js"></script>
            <script src="./frames/popper.min.js"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
            <script>
                window.history.pushState("", "", "/login");
            </script>
        </body>
        </html>`
    },
    viewPassChange: () => {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
            <!-- Bootstrap CSS -->
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
            <link rel="stylesheet" type="text/css" href="./style/style.css">
            <title>Money Memory</title>
        </head>
        <body>
        
        <div class="container col-xl-4 col-lg-6 col-md-6 col-sm-10 cont-log" >
        <form class="cl-log-form" action="/changepass" method="post">
            <img src="../bilder/mm.png" alt="MM" id="mm">
            <div class="form-group">
                <label for="password" class="label-text">Altes Passwort:</label>
                <input type="password" class="form-control border__style login-nutzer-falsch" id="input-benutzername" aria-describedby="emailHelp" name="passwordone" autofocus>
                <small id="emailHelp" class="form-text text-muted">Bitte geben Sie ihr altes Passwort ein.</small>
            </div>
            <div class="form-group">
                <label for="password" class="label-text">Neues Passwort:</label>
                <input type="password" class="form-control border__style login-nutzer-falsch" id="input-benutzername" aria-describedby="emailHelp" name="passwordtwo">
                <small id="emailHelp" class="form-text text-muted">Bitte geben Sie ihren neuen Password ein.</small>
            </div>
            <div class="form-group">
                <label for="password" class="label-text">Neues Passwort:</label>
                <input type="password" class="form-control border__style login-nutzer-falsch" id="input-benutzername" aria-describedby="emailHelp" name="passwordthree">
                <small id="emailHelp" class="form-text text-muted">Bitte geben Sie ihren neuen Password ein.</small>
            </div>
      
            <button type="submit" class="btn btn-primary btn-lg btn-block butt-speichern">Senden</button>
          
            <div class="form-group form-check reg-div">
                <a href="/main" id="a-reg" method="get"><span class="reg-tag">Zurück zur Main Seite!</span></a>
                <div class="fehler-div" style="color:red"></div>
            </div>
        </form>
      </div>
        
            <!-- jQuery first, then Popper.js, then Bootstrap JS -->
            <script src="./frames/jquery-3.5.1.min.js"></script>
            <script src="./frames/popper.min.js"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
            <script>
                window.history.pushState("", "", "/login");
            </script>
        </body>
        </html>`
    },
    passNotSameErrorMessage: () => {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
            <!-- Bootstrap CSS -->
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
            <link rel="stylesheet" type="text/css" href="./style/style.css">
            <title>Money Memory</title>
        </head>
        <body>
        
        <div class="container col-xl-4 col-lg-6 col-md-6 col-sm-10 cont-log" >
        <form class="cl-log-form" action="/changepass" method="post">
            <img src="../bilder/mm.png" alt="MM" id="mm">
            <div class="form-group">
                <h3 style="color:red">Fehler, bitte versuchen Sie es erneut!</h3>
                <label for="password" class="label-text">Altes Passwort:</label>
                <input type="password" class="form-control border__style login-nutzer-falsch" id="input-benutzername" aria-describedby="emailHelp" name="passwordone" autofocus>
                <small id="emailHelp" class="form-text text-muted">Bitte geben Sie ihr altes Passwort ein.</small>
            </div>
            <div class="form-group">
                <label for="password" class="label-text">Neues Passwort:</label>
                <input type="password" class="form-control border__style login-nutzer-falsch" id="input-benutzername" aria-describedby="emailHelp" name="passwordtwo">
                <small id="emailHelp" class="form-text text-muted">Bitte geben Sie ihren neuen Password ein.</small>
            </div>
            <div class="form-group">
                <label for="password" class="label-text">Neues Passwort:</label>
                <input type="password" class="form-control border__style login-nutzer-falsch" id="input-benutzername" aria-describedby="emailHelp" name="passwordthree">
                <small id="emailHelp" class="form-text text-muted">Bitte geben Sie ihren neuen Password ein.</small>
            </div>
      
            <button type="submit" class="btn btn-primary btn-lg btn-block butt-speichern">Senden</button>
          
            <div class="form-group form-check reg-div">
                <a href="/main" id="a-reg" method="get"><span class="reg-tag">Zurück zur Main Seite!</span></a>
                <div class="fehler-div" style="color:red"></div>
            </div>
        </form>
      </div>
        
            <!-- jQuery first, then Popper.js, then Bootstrap JS -->
            <script src="./frames/jquery-3.5.1.min.js"></script>
            <script src="./frames/popper.min.js"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
            <script>
                window.history.pushState("", "", "/login");
            </script>
        </body>
        </html>`
    },
    closeModal: () => {
        // return alert("test");
        // $(".modal-dialog .btn-secondary").trigger("click");
    }
}
module.exports = MVCview;















