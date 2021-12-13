const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const methodOverride = require("method-override");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieSession({
  name: "session",
  keys: ["welcome2powTinyApp", "helloWorld!"]
}));
app.use(methodOverride("_method"));

const urlsDB = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userId: "000000",
    createdDate: "2021/12/12",
    visits: 0,
    records: [],
    uniqueVisits: 0
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userId: "885188",
    createdDate: "2021/12/23",
    visits: 0,
    uniqueVisits: 0,
    records: []
  }
};
const usersDB = {
  "000000": {
    userId: "000000",
    email: "mht@qq.com",
    password: bcrypt.hashSync("txqq", 10) 
  },
  "885188": {
    userId: "885188",
    email: "my@ali.com",
    password: bcrypt.hashSync("buyit", 10)
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
////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});

//Handle GET request
app.get("/", (req, res) => {
  return res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const user = usersDB[req.session.userId];
  if (!user) {
    return res.redirect("/login");
  }
  const userURLs = urlsForUser(user.userId, urlsDB);
  const templateVars = {
    urls: userURLs,
    user
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = usersDB[req.session.userId];
  if (!user) {
    return res.redirect("/login");
  }
  const templateVars = {
    user,
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const user = usersDB[req.session.userId];
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
    visits: urlsDB[shortURL].visits,
    uniqueVisits: urlsDB[shortURL].uniqueVisits,
    records: urlsDB[shortURL].records,
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
  urlObj.visits += 1;
  
  if (!req.session.visitorId) {
    const visitorId = generateRandomString();
    req.session.visitorId = visitorId;
    urlObj.uniqueVisits += 1;
  }
  urlObj.records.push(`visitId: ${req.session.visitorId} visited at${getTimeStamp()}`);
  return res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const user = usersDB[req.session.userId];
  if (user) {
    return res.redirect("/urls");
  }
  const templateVars = {
    user
  };
  return res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const user = usersDB[req.session.userId, usersDB];
  if (user) {
    return res.redirect("/urls");
  }
  const templateVars = {
    user
  };
  return res.render("login", templateVars);
});

//end point of create new URL obj
app.post("/urls", (req, res) => {
  const user = usersDB[req.session.userId];
  if (!user) {
    return res.redirect("/login");
  }
  const longURL = completeURL(req.body.longURL);
  const shortURL = generateRandomString();
  const createdDate = getTimeStamp();
  const userId = user.userId;
  urlsDB[shortURL] = {
    longURL,
    createdDate,
    userId,
    visits: 0,
    uniqueVisits: 0,
    records: [],
  };
  return res.redirect(`/urls/${shortURL}`);
});

//end point of delete URL obj
app.delete("/urls/:shortURL", (req, res) => {
  const user = usersDB[req.session.userId];
  const shortURL = req.params.shortURL;
  if (!user) {
    return res.redirect("/login");
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
app.put("/urls/:shortURL", (req, res) => {
  const user = usersDB[req.session.userId];
  const shortURL = req.params.shortURL;
  if (!user) {
    return res.redirect("/login");
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
  const {email, password} = req.body;
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
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(403).send("<h1>Wrong password!</h1>");
  }
  req.session.userId = user.userId;
  return res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session.userId = null;
  return res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  let password = req.body.password;
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
  password = bcrypt.hashSync(password, 10);
  usersDB[userId] = {
    userId,
    email,
    password
  };
  req.session.userId = userId;
  return res.redirect("/urls");
});


















app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>");
});

//SHOW OUT DB!
app.get("/urls.json", (req, res) => {
  res.json([urlsDB, usersDB]);
});