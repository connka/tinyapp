var express = require("express");
const bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
var PORT = 8080; // default port 8080

app.set("view engine", "ejs")

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("<html><head>Tiny App!!</head></html>");
});

// app.get("/hello", (req, res) => {
//     res.send("<html><body>Hello<b>World</b></body></html>\n");
// });
///////////////FUNCTIONS///////////////
function generateRandomString(stringLength) {
let output = [];
let str = "";

for (var i = 0; i < stringLength; i++){
  let ranNum = String.fromCharCode(Math.random());
  if(ranNum === "/" || ranNum === "\\") {
    ranNum = "x";
  };
  output.push(ranNum);
}
str = output/join('');
return str;
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

//redirects valid url, else return 404
  app.get("/u/:shortURL", (req, res) => {
    if(urlDatabas[req.params.shortURL]){
      res.statusCode = 308;
      res.redirect(`${urlDatabase[req.params.shortURL].url}`);
    } else {res.statusCode = 404;
      res.send("<h1>Error 404: Page not found.");
    }
  });
  
app.post("/urls", (req, res) => {
    console.log(req.body);  // debug statement to see POST parameters
    res.send("Ok");         // Respond with 'Ok' (we will replace this)
  });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

