const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { use } = require("express/lib/application");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

const urlsDB = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const usersDB = {
  "000000": {
    userId: "000000",
    email: "mht@qq.com",
    password: "txqq" 
  },
  "885188": {
    userId: "885188",
    email: "my@ali.com",
    password: "buyit"
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
const emailExist = (email, users) => {
  for (const userID in users) {
    if (users[userID].email === email) {
      return true;
    }
  }
  return false;
};
const findUser = (userId, users) => {
  for (const id in users) {
    if (id === userId) {
      return users[id];
    }
  }
  return null;
};




app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});

//Handle GET request
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const user = findUser(req.cookies.userId, usersDB);
  const templateVars = {
    urls: urlsDB,
    user
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = findUser(req.cookies.userId, usersDB);
  const templateVars = {
    user,
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const user = findUser(req.cookies.userId, usersDB);
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlsDB[req.params.shortURL],
    user,
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlsDB[req.params.shortURL];
  return res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const user = findUser(req.cookies.userId, usersDB);
  const templateVars = {
    user
  };
  return res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const user = findUser(req.cookies.userId, usersDB);
  const templateVars = {
    user
  };
  return res.render("login", templateVars);
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

app.post("/urls/:shortURL/update", (req, res) => {
  const newLongURL = completeURL(req.body.longURL);
  const shortURL = req.params.shortURL;
  urlsDB[shortURL] = newLongURL;
  return res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  return res.cookie("username", username).redirect("/urls");
});

app.post("/logout", (req, res) => {
  return res.clearCookie("userId").redirect("urls");
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email) {
    return res.status(400).send("<h1>Please enter your email address to finish register!</h1>");
  }
  if (!password) {
    return res.status(400).send("<h1>Please enter passowrd to finish register!</h1>");
  }
  if (emailExist(email)) {
    return res.status(400).send("<h1>You already registered with this email address!</h1>");
  }
  const userId = generateRandomString();
  usersDB[userId] = {
    userId,
    email,
    password
  };
  return res.cookie("userId", userId).redirect("/urls");
});


















app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>");
});

//SHOW OUT DB!
app.get("/urls.json", (req, res) => {
  res.json([urlsDB, usersDB]);
});