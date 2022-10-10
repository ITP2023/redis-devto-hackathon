const express = require("express");
const redis = require("redis");
const REDIS_CREDS = require("./redis_creds.json");

const app = express();
const redisClient = redis.createClient(REDIS_CREDS);

app.use((req, res, next) => {
  req.redis = redisClient;
  next();
});

const authRouter = require("./auth");
const cartRouter = require("./cart");
const productsRouter = require("./products");

app.use("/auth", authRouter);
app.use("/carts", cartRouter);
app.use("/products", productsRouter);

app.listen(4000, () => {
  console.log("started @ ::4000")
});