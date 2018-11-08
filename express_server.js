const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"]
  })
);
app.set("view engine", "ejs");
// URL database
let urlDatabase = {
  b2xVn2: { url: "http://www.lighthouselabs.ca", userID: "f84hg6" },
  "9sm5xK": { url: "http://www.google.com", userID: "34fg56" }
};
// User database
let users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  }
};
////////FUNCTIONS/////////
// Random string generator
function generateRandomString() {
  const charSet = "abcdefghijklmnopqrstuvwxyz123456789";
  let randomString = "";
  for (i = 0; i < 6; i++) {
    let randomNum = Math.floor(Math.random() * 31);
    randomString += charSet[randomNum];
  }
  return randomString;
}
//////////GET ROUTES//////////
//////User-based routes//////

// User login page
app.get("/urls/login", (req, res) => {
  res.render("urls_login");
});
// User login handler
app.post("/urls/login", (req, res) => {
  let email = req.body["email"];
  let password = req.body["password"];
  if (!email || !password) {
    res.redirect("/urls/login/error");
  }
  let id;
  for (user_id in users) {
    if (!users.hasOwnProperty(user_id)) {
      continue;
    }
    if (
      email === users[user_id]["email"] &&
      bcrypt.compareSync(password, users[user_id]["password"])
    ) {
      id = user_id;
      break;
    }
  }
  if (id) {
    req.session.user_id = id;
    res.redirect("/urls/");
  } else {
    res.redirect("/urls/login/error");
  }
});

//User error
app.get("/urls/login/error", (req, res) => {
  res.render("urls_login_error");
});

// User logout
app.post("/urls/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/urls/");
});

// User registration page
app.get("/urls/register", (req, res) => {
  res.render("urls_register");
});
// User registration handler
app.post("/urls/register", (req, res) => {
  let id = generateRandomString();
  let email = req.body["email"];
  let password = req.body["password"];
  let hashedPassword = bcrypt.hashSync(password, 10);
  if (!email || !password) {
    res.sendStatus(400);
  } else if (email && password) {
    for (prop in users) {
      if (email === users[prop]["email"]) {
        res.sendStatus(400);
      } else {
        users[id] = {
          id: id,
          email: email,
          password: hashedPassword
        };
        req.session.user_id = id;
        res.redirect("/urls/");
      }
    }
  } else {
    res.sendStatus(404);
  }
});

//////URL Routes//////
// Landing page
app.get("/", (req, res) => {
  res.render("landing_page");
});
// Urls list page
app.get("/urls", (req, res) => {
  let templateVars = {
    user_id: users[req.session.user_id],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

// New URL
app.get("/urls/new", (req, res) => {
  let templateVars = {
    user_id: users[req.session.user_id]
  };
  if (req.session.user_id) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/urls/login");
  }
});

// New URL Handler
app.post("/urls", (req, res) => {
  let newURL = req.body["longURL"];
  let shortenedURL = generateRandomString();
  urlDatabase[shortenedURL] = {};
  urlDatabase[shortenedURL]["url"] = newURL;
  urlDatabase[shortenedURL]["userID"] = req.session.user_id;
  res.redirect("/urls/");
});

// Delete URL
app.post("/urls/:id/delete", (req, res) => {
  if (urlDatabase[req.params.id]["userID"] === req.session.user_id) {
    delete urlDatabase[req.params.id];
    res.redirect("/urls/");
  } else {
    res.redirect("/urls/");
  }
});

// Redirect to URL website
app.get("/urls/:shortURL", (req, res) => {
  let id = urlDatabase[req.params.shortURL];
  res.redirect(id["url"]);
});

// Edit URL
app.get("/urls/:id/edit", (req, res) => {
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    user_id: users[req.session.user_id]
  };
  if (urlDatabase[req.params.id]["userID"] === req.session.user_id) {
    res.render("urls_show", templateVars);
  } else {
    res.redirect("/urls/");
  }
});

// Edit URL handler
app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id]["url"] = req.body["longURL"];
  res.redirect("/urls/");
});

// Error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res
    .status(500)
    .send(
      "Oops! Something isn't right here! Please go back to the previous page"
    );
});

// Port listener
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
