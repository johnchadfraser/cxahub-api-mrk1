//Get authentication token from Emarsys.
const crypto = require("crypto");

function getWsseHeader(user, secret) {
  let nonce = crypto.randomBytes(16).toString("hex");
  let timestamp = new Date().toISOString();
  let digest = base64Sha1(nonce + timestamp + secret);
  let token = `UsernameToken Username="${user}", PasswordDigest="${digest}", Nonce="${nonce}", Created="${timestamp}"`;

  return token;
}

function base64Sha1(str) {
  let hexDigest = crypto.createHash("sha1").update(str).digest("hex");

  return new Buffer.from(hexDigest).toString("base64");
}

module.exports = {
  getWsseHeader,
};
