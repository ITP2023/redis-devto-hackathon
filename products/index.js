const express = require("express");

const router = express.Router();

/**
 * /products/search?q=somethingtosearch
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const searchProductsHandler = async (req, res, next) => {
  const { q } = req.query;
  console.log(q);
  await req.redis.connect();
  const result = await req.redis.ft.search("productsIdx", `@name:${q}`);
  await req.redis.disconnect();
  if (!result) {
    res.status(400).send({ error: "ERROR_SEARCH_ITEM_NOT_FOUND" })
    return `FAIL (ERROR_ITEM_NOT_FOUND) @ ${req.url}`;
  }
  res.status(200).send(result);
  return `OK @ ${req.url}`;
}


/**
 * /products/p/:product_id
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
const getProductHandler = async (req, res, next) => {
  const { product_id } = req.params;
  await req.redis.json.connect();
  const supposedResult  = await req.redis.json.get(`product:${product_id}`, `$`);
  if (!supposedResult) {
    res.status(400).send({ error: "Product not found" });
    return `Fail (no result found) @ ${req.url}`;
  }
  res.status(200).send(supposedResult);
  return `OK(sent result) @ ${req.url}`;
}

router.get("/p/:product_id", (req, res, next) => {
  getProductHandler(req, res, next)
  .then(console.log)
  .catch(console.error);
});

router.get("/search", (req, res, next) => {
  searchProductsHandler(req, res, next)
  .then(console.log)
  .catch(console.error);
});

module.exports = router;