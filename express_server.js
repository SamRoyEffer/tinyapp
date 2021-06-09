const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const PORT = 8080;
app.use(express.urlencoded({ extented: true }));
app.set("view engine", "ejs");
app.use(cookieParser());

const generateRandomString = () => Math.random().toString(36).substr(2, 8);
const urlDatabase = {
  // memory of url codes
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

//creating a new url
app.get("/urls/new", (req, res) => {
  console.log('added a new url')
  const templateVars = {
    username: req.cookies["username"],
  
  }
  res.render("urls_new", templateVars); 
});

// adding a long url to make shor url 
app.get("/urls/:shortURL", (req, res) => {
  console.log('')
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"],
    
  };
  console.log(urlDatabase);
  
  res.render("url_show", templateVars);
});
app.get('/logout', function(req, res) {
  res.clearCookie("username")
  res.redirect("/")
})

// redirects to urls page
app.get("/", (req, res) => {
  res.redirect("/urls"); 
});


// show list of urls
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, 
    username: req.cookies["username"] };
  res.render("url_index", templateVars); // list of saved urls
});

// gets the short urls and send the user to the longurl page
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const fetchedURL = urlDatabase[shortURL];
  console.log(fetchedURL);
  res.redirect(fetchedURL);
});

//get the login infor and check to see if it exists
app.get("/login", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
  };
  res.redirect("/urls");
});

// checks the user when logged in send to the home page
app.post("/login", (req, res) => {
  let username = req.body.username;
  res.cookie("username", username);
  res.redirect("/urls");
});

// shows the new short url code for the longurl
app.post("/urls", (req, res) => {
  console.log("Showing url page",JSON.stringify(req.body));
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect('/urls');
});

//removes a short and long url
app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  console.log(shortURL);
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

//edits the long url associated with the short url
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
