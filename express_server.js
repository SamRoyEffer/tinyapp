const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const PORT = 8080;
app.use(express.urlencoded({ extented: true }));
app.set("view engine", "ejs");
app.use(cookieParser());
const generateRandomString = () => Math.random().toString(36).substr(2, 8);


const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};
const getUserByEmail = (email) => {
  const keys = Object.keys(users)
  for (let key of keys) {
    const user = users[key]
    if(user.email === email) {
      return user;
    }
  }
  return null;
}

const urlsForUser = (id) => {
  const keys = Object.keys(urlDatabase)
    for(let key of keys){
    const user = id[key];
    if  (user.userID === id) {
      return user;
    }
  }
  return null;
}

// redirects to urls page
app.get("/", (req, res) => {
  templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: req.cookies["user_id"],
  }
  res.render("main-page", templateVars); 
});

//get the login infor and check to see if it exists
app.get("/login", (req, res) => {
  const templateVars = {
    user: null
  }
  res.render('login_page', templateVars)
});

// checks the user when logged in send to the home page
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password

  const user = getUserByEmail(email)
  if (!user || user.password !== password) {
    return res.status(400).send("Wrong User or Password!")
  }
  res.cookie("user_id", user.id);
  res.redirect("/urls");
});

app.post('/logout', function(req, res) {
  res.clearCookie("user_id")
  res.redirect("/")
})

// getting registration screen
app.get("/register",(req, res) =>{
  const templateVars = {user: req.cookies["user_id"]};
  res.render("register", templateVars)
});

app.post("/register", (req, res) =>{
  const email = req.body.email;
  const password = req.body.password

  if (getUserByEmail(email)) {
    return res.status(400).send("Wrong User name or Password");
  };
  const id = generateRandomString();
  const user = {id, email, password}
  users[id] = user;
  res.cookie('user_id', id)
  
  res.redirect('/urls')
})

//creating a new url
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],
  
  }
  res.render("urls_new", templateVars); 
});

// show list of urls
app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase, 
    user: users[req.cookies["user_id"]],
  };

  res.render("url_index", templateVars); // list of saved urls
});

// shows the new short url code for the longurl
app.post("/urls", (req, res) => {
  const userID = urlsForUser(id);
  if (!userID || userID.userID !== id) {
    return res.status(400).send("Please sign in!")
  }
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect('/urls');
});

//removes a short and long url
app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  const idCompare = urlDatabase[shortURL].userID
  if ("user_id" === idCompare){
    delete urlDatabase[shortURL];
  }
  res.redirect("/urls");
});

//edits the long url associated with the short url
app.post("/urls/:shortURL", (req, res) => {
  const userID = urlsForUser(id);
  if (!userID || userID.userID !== id) {
    return res.status(400).send("Please sign in!")
  }
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect('/urls');
});

// gets the short urls and send the user to the longurl page
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const fetchedURL = urlDatabase[shortURL];
  
  res.redirect(fetchedURL);
});
// adding a long url to make shor url 
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies["user_id"]],
    
  };
  
  res.render("url_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
