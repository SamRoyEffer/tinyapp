const express = require("express");
const app = express();
const PORT = 8080;
app.use(express.urlencoded({ extented: true }));
app.set("view engine", "ejs");

const urlDatabase = {
  // memory of url codes
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
  res.send("Hello!"); // initial homepage
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase); // json page of the database
});
app.get("/hello", (req, res) => {
  // practice page
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("url_index", templateVars); // list of saved urls
});
app.post("/urls", (req, res) => {
  console.log(req.body);
  res.send("Ok");
});
app.post("/urls_added", (req, res) => {});
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
const generatRandomString = (length) => {
  Math.random().toString(36).substr(2, 8);
};
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
