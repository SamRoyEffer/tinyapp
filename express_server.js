const express = require("express");
const app = express();
const PORT = 8080;
const cookieSession = require("cookie-session");
app.use(express.urlencoded({ extented: true }));
app.set("view engine", "ejs");
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

const {
  authenticationOfUsers,
  createNewUsers,
  urlsForUser,
  getUserByEmail,
  generateRandomString,
} = require("./helpers");

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
};

//CREATE
//creating a new url
app.get("/urls/new", (req, res) => {
  const userCookie = req.session["user_id"];
  if (!userCookie) {
    res.status(400).send("Please sign in!");
  }
  const templateVars = {
    user: users[req.session["user_id"]],
  };
  res.render("urls_new", templateVars);
});

//READ
// redirects to urls page
app.get("/", (req, res) => {
  res.redirect("/urls");
});

//redirects to main page with new long url
app.post("/urls/:shortURL", (req, res) => {
  const { shortURL } = req.params;
  const idCompare = urlDatabase[shortURL].userID;
  if (req.session["user_id"] === idCompare) {
    const shortURL = req.params.shortURL;
    urlDatabase[shortURL].longURL = req.body.longURL;
    urlDatabase[shortURL].userID = req.session["user_id"];

    res.redirect("/urls");
  }
  res.status(400).send("Please sign in.");
});

//take to website url
app.get("/u/:shortURL", (req, res) => {
  try {
    const shortURL = req.params.shortURL;
    let longURL = urlDatabase[shortURL].longURL;
    if (!longURL.includes("http://")) {
      longURL = "http://" + longURL;
    }
    res.redirect(longURL);
  } catch (error) {
    return res.status(404).send("Error 404! No website found.");
  }
});

// show list of urls for logged in user
app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    const allURLS = urlsForUser(userID, urlDatabase);
    const templateVars = {
      urls: allURLS,
      user: users[req.session["user_id"]],
    };
  }
  const allURLS = urlsForUser(userID, urlDatabase);
  const templateVars = {
    urls: allURLS,
    user: users[req.session["user_id"]],
  };

  res.render("url_index", templateVars);
});

// shows the new short url code for the longurl
app.post("/urls", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    return res.status(400).send("Please sign in!");
  }
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: userID };
  res.redirect("/urls");
});

//UPDATE

// editing short url with different long url
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const userCookie = req.session["user_id"];
  const shortLink = urlDatabase[shortURL];
  if (userCookie) {
    if (!shortLink) {
      return res.status(404).send("Error 404! No website found.");
    }
    const userCode = shortLink.userID;
    if (userCookie === userCode) {
      const templateVars = {
        shortURL: req.params.shortURL,
        longURL: urlDatabase[req.params.shortURL].longURL,
        user: users[req.session["user_id"]],
      };
      return res.render("url_show", templateVars);
    }
  }
  res.status(400).send("Please sign in!");
});

//DELETE
//removes a short and long url
app.post("/urls/:shortURL/delete", (req, res) => {
  const { shortURL } = req.params;
  const idCompare = urlDatabase[shortURL].userID;
  if (req.session["user_id"] === idCompare) {
    delete urlDatabase[shortURL];
  }
  res.redirect("/urls");
});

//AUTHENTICATION

app.get("/login", (req, res) => {
  const userCookie = req.session["user_id"];
  if (userCookie) {
    res.redirect("/urls");
  } else {
    const templateVars = {
      user: null,
    };
    res.render("login_page", templateVars);
  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = authenticationOfUsers(email, password, users);
  if (user) {
    req.session["user_id"] = user.id;
    res.redirect("/urls");
  } else {
    res.status(401).send("Please Try Again.");
  }
});

app.post("/logout", (req, res) => {
  req.session["user_id"] = null;
  res.redirect("/urls");
});

// getting registration screen
app.get("/register", (req, res) => {
  const userCookie = req.session["user_id"];
  if (userCookie) {
    res.redirect("/urls");
  } else {
    const templateVars = { user: users[req.session["user_id"]] };
    res.render("register", templateVars);
  }
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = getUserByEmail(email, users);
  if (!password || !email) {
    return res.status(400).send("Please add Credentials.");
  }
  if (user) {
    return res.status(400).send("Credientials Already in Use.");
  }
  const newID = createNewUsers(email, password, users);
  req.session["user_id"] = newID;
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
