const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));

const urlsDB = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const usersDB = {
  "userID1": {
    email: "2690@qq.com",
    password: "2690" 
  }
};
//Helper functions
const generateRandomString = () => {
  const letterList = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const generatedArray = [];
  let n = 1;
  while (n <= 6) {
    const index = Math.floor(Math.random() * 62);
    generatedArray.push(letterList[index]);
    n++;
  }
  return generatedArray.join("");
};
const completeURL = (url) => {
  let compltURL = url;
  const head1 = "http://";
  const head2 = "www.";
  if (!url.includes(head2)) {
    compltURL = head2 + compltURL;
  }
  if (!url.includes(head1)) {
    compltURL = head1 + compltURL;
  }
  return compltURL;
};




app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});

//Handle GET request
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlsDB
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlsDB[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlsDB[req.params.shortURL];
  return res.redirect(longURL);
});


app.post("/urls", (req, res) => {
  const longURL = completeURL(req.body.longURL);
  const shortURL = generateRandomString();
  urlsDB[shortURL] = longURL;
  return res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlsDB[shortURL];
  return res.redirect("/urls");
});

















app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>");
});

//SHOW OUT DB!
app.get("/urls.json", (req, res) => {
  res.json([urlsDB, usersDB]);
});