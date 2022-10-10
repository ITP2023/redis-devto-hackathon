const crypto = require("crypto");

class Product {
  constructor(
    id = "",
    url = "",
    sk = "",
    name = "",
    style = "",
    description = "",
    category = "",
    aliases = [],
    price = 0.00,
    image = "",
    featured = "",
    genderAffinity = "",
    currentStock = 0
  ) {
    this.id = id;
    this.url = url;
    this.sk = sk;
    this.name = name;
    this.style = style;
    this.category = category;
    this.description = description;
    this.aliases = aliases;
    this.price = price;
    this.image = image;
    this.featured = featured;
    this.gender_affinity = genderAffinity;
    this.current_stock = currentStock;
  }
}

const isFloat = num => isFinite(num) && !isNaN(num) && num.toString().includes(".");


const generateUniqueProductID = () => {
  let randomValue1 = crypto.randomUUID();
  let randomValue2 = crypto.randomUUID();
  randomValue1 = randomValue1.split("-");
  randomValue2 = randomValue2.split("-");
  randomValue1.pop();
  randomValue2.shift();
  return randomValue1.join("-") + "-" + randomValue2.join("-");
}

module.exports = {
  generateUniqueProductID,
  isFloat,
  Product
}