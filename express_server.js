const express = require("express");
const app = express();
const PORT = 8080; 
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls", (req, res) => {
  const templateVars = {urls: urlDatabase};
  res.render("url_index", templateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL: req.params.longURL};
  res.render("url_show", templateVars);
});
app.post("/urls", (req, res) => {
  console.log(req.body);
  res.send("Ok");         
});
const generatRandomString = (length) => {
  const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = ' ';
  const charLength = char.length;
  for (let charater of char) {
    code += char.charAt(Math.floor(Math.random() * charLength));
  }
  return code;
}
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});