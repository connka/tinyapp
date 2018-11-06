var express = require("express");
const bodyParser = require("body-parser");
var app = express();
var PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));


//URL Database
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//User Database
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

///////////////FUNCTIONS///////////////
//URL String generator
var generateRandomString = function() {
  var string = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++) {
    string += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return string;
};

///////////////GET ROUTES///////////////

app.get("/", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  }
  res.render("urls_new", templateVars);
});

//new url
app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

  //Submit an edit url
app.get("/urls/:id", (req, res) => {
    let templateVars = { 
      shortURL: req.params.id,
      username: req.cookies["username"] 
  };
    res.render("urls_show", templateVars);
    });

 app.post("/urls/:id/", (req, res) => {
  console.log("the post" + req.body.longURL)
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls/");
});

//Displays Archive
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, 
  username: req.cookies["username"]
};
  res.render("urls_index", templateVars);
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
  //console.log('urls/:shortURLID')
  delete urlDatabase[req.params.shortURLID];
  res.redirect(`/urls`);
});

//User login
app.get("/login", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  };
  res.render("urls_login", templateVars);
});

app.post("/login",(req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/");
  });

  //User logout

  app.post("/logout", (req, res) => {
    res.clearCookie("username");
    res.redirect("/urls/");

});

// User registration page
app.get("/register", (req, res) => {
  res.render("urls_register");
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
