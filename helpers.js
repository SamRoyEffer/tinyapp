const bcrypt = require("bcrypt");
const saltRounds = 10;

const getUserByEmail = (email, database) => {
  const keys = Object.keys(database);
  for (let key of keys) {
    const user = database[key];
    if (user.email === email) {
      return user;
    }
  }
  return undefined;
};

const urlsForUser = (id, database) => {
  const urls = {};

  for (let shortUrls in database) {
    if (database[shortUrls].userID === id) {
      urls[shortUrls] = { longURL: database[shortUrls].longURL, userID: id };
    }
  }
  return urls;
};

const newUser = (email, password, database) => {
  const id = generateRandomString();
  const newUserO = {
    id,
    email,
    password: bcrypt.hashSync(password, saltRounds),
  };
  database[id] = newUserO;

  return id;
};

const authentication = (email, password, database) => {
  const user = getUserByEmail(email, database);
  if (user && bcrypt.compareSync(password, user.password)) {
    return user;
  }
  return false;
};
const generateRandomString = () => Math.random().toString(36).substr(2, 8);

module.exports = {
  authentication,
  newUser,
  urlsForUser,
  getUserByEmail,
  generateRandomString,
};
