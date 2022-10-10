const jwt = require("jsonwebtoken");
const fs = require("fs");

const KEY = fs.readFileSync("./secret.key");



const makeAndSignToken = (object) => {
  const signedToken = jwt.sign(object, KEY, {
    expiresIn: "1h", 
    algorithm: "RS256"
  });
  return signedToken;
}

const verifyAndDecodeToken = (token) => {
  try {
    const verificationResult = jwt.verify(token, KEY, {
      algorithms: [ "RS256" ],
      ignoreExpiration: false
    });
    return verificationResult;
  }
  catch (error) {
    console.error(error);
    return null;
  }
  
}


module.exports = { 
  makeAndSignToken,
  verifyAndDecodeToken
};