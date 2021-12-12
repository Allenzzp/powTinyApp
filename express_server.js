const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

const urlsDB = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userId: "000000",
    createdDate: "2021/12/12"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userId: "885188",
    createdDate: "2021/12/23" 
  }
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
const findUserByemail = (email, users) => {
  for (const id in users) {
    if (users[id].email === email) {
      return users[id];
    }
  }
  return false;
};
const findUserById = (userId, users) => {
  for (const id in users) {
    if (id === userId) {
      return users[id];
    }
  }
  return null;
};
const getTimeStamp = () => {
  const date = new Date();
  const [month, day, year]       = [date.getMonth(), date.getDate(), date.getFullYear()];
  return ` ${year}/${month}/${day}`;
};
const urlsForUser = (id, urls) => {
  const filteredUrls = {};
  for (const shortURL in urls) {
    if (urls[shortURL].userId === id) {
      filteredUrls[shortURL] = urls[shortURL];
    }
  }
  return filteredUrls;
};


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});

//Handle GET request
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const user = findUserById(req.cookies.userId, usersDB);
  if (!user) {
    return res.status(401).send("<h1>You need to login first!</h1>");
  }
  const userURLs = urlsForUser(user.userId, urlsDB);
  const templateVars = {
    urls: userURLs,
    user
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = findUserById(req.cookies.userId, usersDB);
  if (!user) {
    return res.status(401).send("<h1>You need to login first!</h1>");
  }
  const templateVars = {
    user,
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const user = findUserById(req.cookies.userId, usersDB);
  const shortURL = req.params.shortURL;
  if (!user) {
    return res.status(401).send("<h1>You need to login first!</h1>");
  }
  const urlObj = urlsDB[shortURL];
  if (!urlObj) {
    return res.status(404).send("<h1>Page Not found!</h1>");
  }
  if (urlsDB[shortURL].userId !== user.userId) {
    return res.status(403).send("<h1>You cannot see others' URLs!</h1>");
  }
  const templateVars = {
    shortURL,
    longURL: urlsDB[shortURL].longURL,
    createdDate: urlsDB[shortURL].createdDate,
    user,
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const urlObj = urlsDB[req.params.shortURL];
  if (!urlObj) {
    return res.status(404).send("<h1>Page Not found!</h1>");
  }
  const longURL = urlObj.longURL;
  return res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const user = findUserById(req.cookies.userId, usersDB);
  const templateVars = {
    user
  };
  return res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const user = findUserById(req.cookies.userId, usersDB);
  const templateVars = {
    user
  };
  return res.render("login", templateVars);
});

//end point of create new URL obj
app.post("/urls", (req, res) => {
  const user = findUserById(req.cookies.userId, usersDB);
  if (!user) {
    return res.status(401).send("<h1>You need to login first!</h1>");
  }
  const longURL = completeURL(req.body.longURL);
  const shortURL = generateRandomString();
  const createdDate = getTimeStamp();
  const userId = user.userId;
  urlsDB[shortURL] = {
    longURL,
    createdDate,
    userId
  };
  return res.redirect(`/urls/${shortURL}`);
});

//end point of delete URL obj
app.post("/urls/:shortURL/delete", (req, res) => {
  const user = findUserById(req.cookies.userId, usersDB);
  const shortURL = req.params.shortURL;
  if (!user) {
    return res.status(401).send("<h1>You need to login first!</h1>");
  }
  const urlObj = urlsDB[shortURL];

  if (!urlObj) {
    return res.status(404).send("<h1>Page Not found!</h1>");
  }
  if (urlsDB[shortURL].userId !== user.userId) {
    return res.status(403).send("<h1>You cannot delete others' URLs!</h1>");
  }
  delete urlsDB[shortURL];
  return res.redirect("/urls");
});

//end point of edit longURL
app.post("/urls/:shortURL/update", (req, res) => {
  const user = findUserById(req.cookies.userId, usersDB);
  const shortURL = req.params.shortURL;
  if (!user) {
    return res.status(401).send("<h1>You need to login first!</h1>");
  }

  const urlObj = urlsDB[shortURL];

  if (!urlObj) {
    return res.status(404).send("<h1>Page Not found!</h1>");
  }
  if (urlsDB[shortURL].userId !== user.userId) {
    return res.status(403).send("<h1>You cannot edit others' URLs!</h1>");
  }
  const newLongURL = completeURL(req.body.longURL);
  urlsDB[shortURL].longURL = newLongURL;
  return res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email) {
    return res.status(400).send("<h1>Please enter your email address to login!</h1>");
  }
  if (!password) {
    return res.status(400).send("<h1>Please enter passowrd to login!</h1>");
  }
  const user = findUserByemail(email, usersDB);
  if (!user) {
    return res.status(403).send("<h1>We cannot find this email address, please register first!</h1>");
  }
  if (user.password !== password) {
    return res.status(403).send("<h1>Wrong password!</h1>");
  }
  return res.cookie("userId", user.userId).redirect("/urls");
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
  if (findUserByemail(email, usersDB)) {
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