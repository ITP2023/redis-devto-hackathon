const bcrypt = require("bcrypt");
const uuid = require("uuid");

const SALT = require("../salt");

const createUser = async (redisClient, userCreds) => {
  const hashedPassword = await bcrypt.hash(userCreds.password, SALT);
  const userID = uuid.v4();
  await redisClient.connect();
  await redisClient.json.set(userCreds.email, "$", {
    password: hashedPassword,
    uid: userID,
    address: !userCreds.address ? "" : userCreds.address,
    created_at: Date.now().toString()
  });
  await redisClient.disconnect();
  return true;
}

module.exports = {
  createUser
};