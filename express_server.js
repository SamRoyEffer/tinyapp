const express = require("express");
const app = express();
const PORT = 8080;
//app.use(express.json({ extented: true }));
app.use(express.urlencoded({ extented: true }));
app.set("view engine", "ejs");

const generateRandomString = () => Math.random().toString(36).substr(2, 8);
const urlDatabase = {
  // memory of url codes
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
  res.redirect("/urls"); // initial homepage
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase); // json page of the database
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("url_index", templateVars); // list of saved urls
});
app.post("/urls", (req, res) => {
  console.log(JSON.stringify(req.body));
  urlDatabase[generateRandomString()] = req.body.longURL;
  res.redirect("/urls/:shortURL");
});
app.get("/u/:shortURL", (req, res) => {
  const longURL = req.body.longURL;
  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new"); // adding new urls
});
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: req.params.longURL,
  };
  res.render("url_show", templateVars);
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
