const express = require("express");

const router = express.Router();

/**
 * /users/:uuid
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const getUserById = async (req, res, next) => {
  const { uuid } = req.params;
  await req.redis.connect();
  const fetchedUser = await req.redis.json.get(`user:${uuid}`, `$`);
  if (!fetchedUser) {
    res.status(404).send({ error: "ERROR_USER_NOT_FOUND" });
    return `FAIL (user not found) @ ${req.url}`;
  }
  res.status(200).send(
    Object.fromEntries(
      Object.keys(fetchedUser)
      .filter(key => key !== "password")
      .map(k => [ k, fetchedUser[k] ])
    )
  );
  return `Success @ ${req.url}`;
}

router.get("/:uuid", (req, res, next) => {
  getUserById(req, res, next)
  .then(console.log)
  .catch(console.error);
});

module.exports = router;