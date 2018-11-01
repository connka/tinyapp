var express = require("express");
const bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
var PORT = 8080; // default port 8080

app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({extended: false}));

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.render("urls_new");
});

///////////////FUNCTIONS///////////////
//URL String generator
var generateRandomString = function() {
  var string = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < 6; i++) {
      string += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return string;
}

///////////////GET ROUTES///////////////
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
  });

app.get("/urls", (req, res) => {
    let templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
  });

//redirects valid url
  app.get("/urls/:shortURL", (req, res) => {
    if(urlDatabas[req.params.shortURL]){
      res.statusCode = 308;
      res.redirect(`${urlDatabase[req.params.shortURL].url}`);
    } else {res.statusCode = 404;
      res.send("<h1>Error 404: Page not found.");
    }
  });
  
  // Generates random URL
  app.post("/urls", (req, res) => {
    console.log(req.body);
    const newID = generateRandomString(); 
    urlDatabase[newID] = req.body.longURL;
    console.log(urlDatabase);
    res.redirect("/urls/");
}); 

// Delete a url
app.post("/urls/:shortURLID/delete", (req, res) => {
    delete urlDatabase[req.params.shortURLID];
    res.redirect(`/urls`);
  });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

