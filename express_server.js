const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
app.set("view engine", "ejs");

// URL database
let urlDatabase = {
  "b2xVn2": {url: "http://www.lighthouselabs.ca", userID: "f84hg6"},
  "9sm5xK": {url: "http://www.google.com", userID: "34fg56"}
};

// User database
let users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  }
};

////////FUNCTIONS/////////

// Random string generator
function generateRandomString() {
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
  let randomString = '';
  for (i = 0; i < 6; i++) {
    let randomNum = Math.floor(Math.random() * 31);
    randomString += charSet[randomNum]
  }
  return randomString;
}

//////////GET ROUTES//////////

//////User-based routes//////

// User login page
app.get("/urls/login", (req, res) => {
  res.render("urls_login");
})

// User login handler
app.post("/urls/login", (req, res) => {
  let id = generateRandomString();
  let email = req.body['email'];
  let password = req.body['password'];
  if (!email || !password) {
    res.sendStatus(400);
  } else if (email && password) {
    for (prop in users) {
      if (email === users[prop]['email'] && password === users[prop]['password']) {
        res.cookie('user_id', users[prop]['id']);
        res.redirect(301, "/urls/");
      }
    }
  res.sendStatus(404);
  }
})

// User logout
app.post("/urls/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect(301, "/urls/");
})

// User registration page
app.get("/urls/register", (req, res) => {
  res.render("urls_register")
})

// User registration handler
app.post("/urls/register", (req, res) => {
  let id = generateRandomString();
  let email = req.body['email'];
  let password = req.body['password'];
  if (!email || !password) {
    res.sendStatus(400);
  } else if (email && password) {
    for (prop in users) {
      if (email === users[prop]['email']) {
        res.sendStatus(400);
      } else {
        users[id] = {
          'id': id,
          'email': email,
          'password': password
        }
        res.cookie('user_id', id);
        res.redirect(301, "/urls/");
      }
    }
  }
})

//////URL Routes//////

// Landing page
app.get("/", (req, res) => {
  res.end("Welcome to tinyAPP!");
})

// Urls list page
app.get("/urls", (req, res) => {
  let templateVars = {
    user_id: users[req.session['user_id']],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
})

// New URL
app.get("/urls/new", (req, res) => {
  let templateVars = {
    user_id: users[req.session['user_id']]
  };
  if (req.session.user_id) {
  res.render("urls_new", templateVars);
} else {
  res.redirect("/urls/login");
}
});

// New URL Handler
app.post("/urls", (req, res) => {
  let newURL = req.body['longURL'];
  let shortenedURL = generateRandomString();
  urlDatabase[shortenedURL] = newURL;
  res.redirect(301, "/urls/");     // redirects to list rather than specified url
  // res.redirect(301, "/urls/" + shortenedURL)
})

// Delete URL
app.post("/urls/:id/delete", (req, res) => {
  if (urlDatabase[req.params.id]['userID'] === req.session.user_id) {
    delete urlDatabase[req.params.id];
  res.redirect("/urls/");
  } else {
    res.redirect("/urls/");
  }
})

// Redirect to URL website
app.get("/urls/:shortURL/redirect", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
})

// Edit URL
app.get("/urls/:id/", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    user_id: users[req.session['user_id']]
  };
  res.render("urls_show", templateVars);
})

// Edit URL handler
app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id] = req.body['longURL'];
  res.redirect("/urls/");
})

// Port listener
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
})