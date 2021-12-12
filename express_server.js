const express = require("express");
const app = express();
const PORT = 8080;

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

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});

//Handle GET request
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>");
});

//SHOW OUT DB!
app.get("/urls.json", (req, res) => {
  res.json([urlsDB, usersDB]);
});