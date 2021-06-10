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

const urlsForUser = (id, database) => {
  const urls = {}
 
    for(let shortUrls in database ){
    if (database[shortUrls].userID === id) {
      urls[shortUrls] = {longURL : database[shortUrls].longURL, userID : id}
    }
  }
  return urls
}

const newUser = (email, password) => {
  const id = generateRandomString();
  const newUserO= {
    id, 
    email, 
    password : bcrypt.hashSync(password, saltRounds),
  }
  users[id] = newUserO;

  return id;
}

const authentication = (email, password) => {
  const user = getUserByEmail(email);
  if (user && bcrypt.compareSync(password, user.password)) {
    return user;
  }
  return false
}

module.exports = {authentication,newUser,urlsForUser,getUserByEmail}