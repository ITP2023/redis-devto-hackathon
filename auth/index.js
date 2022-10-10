const express = require("express")

const { createUser } = require("./utils");
const { makeAndSignToken } = require("../utils");

const router = express.Router();


router.use(express.urlencoded({ extended: false }));

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @returns {void}
 */
const routeForGivingToken = async (req, res) => {
  const data = req.body;
  console.log(data);
  const userEmailAsKeyString = req.body.email;
  const password = req.body.password;
  if (!userEmailAsKeyString) {
    res.status(400).send({ error: "missing field 'email'" });
    return null;
  }

  await req.redis.connect()
  const fetchedPassword = await redis.json.get(userEmailAsKeyString, {
    paths: [ `.password`, `.uid`, `.email`, `.address` ]
  });
  await req.redis.disconnect();
  
  if (fetchedPassword !== password) {
    res.status(400).send({ error: "incorrect password" })
    return null;
  }

  const fetchedData = value.toJSON();
  console.log(fetchedData);
  const { uid, email, nickname, address } = fetchedData;
  const payloadToBeSignedToMakeToken = {
    uid, email, nickname, address
  };
  const tokenToBeSent = makeAndSignToken(payloadToBeSignedToMakeToken);
  res
  .setHeader("Authorization", `Bearer ${tokenToBeSent}`)
  .status(200)
  .send();
  
  
}

/**
 * Route for registering
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const registerAUser = async (req, res) => {
  const { username, password, email, password_repeat } = req.body;
  
  if (!username || !password || !email || !password_repeat) {
    res.status(400).send({ error: "missing fields" });
    return false;
  }

  if (password !== password_repeat) {
    res.status(400).send({ error: "passwords must be equal" });
    return false;
  }

  let creationSuccess = await createUser(req.redis, {
    username, password, email
  });

  if (!creationSuccess) {
    res.status(500).send({ error: "server was unable to create a user" });
    return false;
  }

  res.status(200).send({ message: "successful creation of user.login again" });
  return true;
}

router.post("/register", (req, res) => {
  registerAUser(req, res)
  .then(ok => console.log(ok ? "[OK @ /register]" : "[Error @ /register]"))
  .catch(console.error);
})

router.post("/login", (req, res) => {
  routeForGivingToken(req, res)
  .then(console.log)
  .catch(console.error);
}); 

router.post("/logout", (req, res) => {
  
});


module.exports = router;