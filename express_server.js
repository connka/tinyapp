///Dependencies
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = 8080; // default port 8080
const cookieSession = require("cookie-session");
const bcrypt = require('bcrypt');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));


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
//Main page
app.get("/", (req, res) => {
  res.render("urls_new");
});

// User registration page
app.get("/register", (req, res) => {
  res.render("urls_register");
})

// User registration handler
app.post("/register", (req, res) => {
  let id = generateRandomString();
  let email = req.body['email'];
  let password = req.body['password'];
  let hashedPassword = bcrypt.hashSync(password, 10);
  if (!email || !password) {
    res.sendStatus(400);
      } 
      else {
        users[id] = {
          'id': id,
          'email': email,
          'password': hashedPassword
        }
        req.session.user_id = id;
        res.redirect("/urls/");
      }
    })

//New url
app.get("/urls/new", (req, res) => {
  console.log(req.session.user_id);
  let templateVars = {
    user_id: users[req.session.user_id]
  };
  if (req.session.user_id) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login/");
  }
  });

//Edit URL
app.get("/urls/:id/edit", (req, res) => {
    let templateVars = { 
      shortURL: req.params.id,
      longURL: urlDatabase[req.params.id],
      user_id: users[req.session.user_id] 
  };
  if (urlDatabase[req.params.id]['userID'] === req.session.user_id) {
    res.render("urls_show", templateVars);
  } else {
     res.redirect("/urls")
  }
    });

//Edit URL handler
 app.post("/urls/:id/edit", (req, res) => {
  console.log("the post" + req.body.longURL)
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls/");
});

//Displays Archive
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, 
    user_id: users[req.session.user_id]
};
  res.render("urls_index", templateVars);
});

// URL creator handler
app.post("/urls", (req, res) => {
  let newURL = req.body['longURL'];
  let newID = generateRandomString();
  urlDatabase[newID] = {};
  urlDatabase[newID]['url'] = newURL;
  urlDatabase[newID]['userID'] = req.session.user_id;
  res.redirect("/urls/");
});

// Delete a url
app.post("/urls/:shortURLID/delete", (req, res) => {
  if (urlDatabase[req.params.id]['userID'] === req.session.user.id) {
    delete urlDatabase[req.params.shortURLID];
    res.redirect(`/urls`);
  } else {
    res.redirect("/urls/")
  }
});

//User login
app.get("/login", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  };
  res.render("urls_login", templateVars);
});

//User login handler
app.post("/login",(req, res) => {
  let id = generateRandomString();
  let email = req.body['email'];
  let password = req.body['password'];
  if (!email || !password) {
    res.sendStatus(400);
  } else if (email && password) {
    for (prop in users) {
      if (email === users[prop]['email'] && bcrypt.compareSync(password, users[prop]['password'])) {
        req.session.user_id = users[prop]['id'];
        res.redirect("/urls/");
      }
    }
  } else {
    res.sendStatus(404);
  }
})

//User logout
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls/");

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
