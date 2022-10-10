const express = require("express");

const router = express.Router();


/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next
 * @returns {Promise<string>}
 */
const getCartOfUser = async (req, res, next) => {
  const { uid } = req.params;
  await req.redis.connect();
  const cartResult = await req.redis.json.get(`cartof:${uid}`, `$`);
  await req.redis.disconnect();
  if (!cartResult) {
    res.status(404).send({ error: "No such user found" });
    return `Fail @ ${req.url}`;
  }
  res.status(200).send(cartResult);
}


/**
 * add to cart
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const addItemToCart = async (req, res, next) => {
  const { uid, product_id } = req.params;
  await req.redis.connect();
  const isOK = await req.redis.json.arrAppend(`cartof:${uid}`, `.items`, {
    product_id
  });
  await req.redis.disconnect();
  if (!isOK) {
    res.status(401).send({ error: "ERROR_UNABLE_TO_ADD_PRODUCT_TO_CART" });
    throw new Error(`FAIL @ ${req.url}`);
  }
  res.status(200).send({ success: true });
  return `OK @ ${req.url}`;
}

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const deleteItemFromCart = async (req, res, next) => {
  const { uid, product_id } = req.params;
  const {item_idx} = req.body;
  await req.redis.connect();
  await req.redis.json.arrTrim(`cartof:${uid}`, `$.items[${item_idx}]`);
  await req.redis.disconnect();
}

router.get("/get/:uid", (req, res, next) => {
  getCartOfUser(req, res, next)
  .then(console.log)
  .catch(console.error);
});


router.post("/add/:uid/:product_id", (req, res, next) => {
  addItemToCart(req, res, next)
  .then(console.log)
  .catch(console.error);
});


router.delete("/remove/:uid/:product_id", (req, res, next) => {
  deleteItemFromCart(req, res, next)
  .then(console.log)
  .catch(console.error);
});



module.exports = router;