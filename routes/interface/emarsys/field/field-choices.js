//Set router object.
const Router = require("express-promise-router");
const router = new Router();
const apicache = require("apicache");
let cache = apicache.middleware;
const cachMins = "20 minutes";
const request = require("request");

//Export our router to be mounted by the parent application
module.exports = router;

//Get emarsys auth.
const auth = require("../auth");

//Set api url, auth header, and endpoint.
const eurl = process.env.EMARSYS_API_URL;

const ep = "field/choices";
//Get all records.
router.get("/", async (req, res) => {
  try {
    const eheader = {
      "X-WSSE": auth.getWsseHeader(
        process.env.EMARSYS_API_USER,
        process.env.EMARSYS_API_USER_SECRET
      ),
    };

    //Build query for this api.
    let epq = "?fields=8876&language=en";

    //Set options for request.
    let options = {
      method: "GET",
      url: eurl + ep + epq,
      headers: eheader,
    };

    //Get request.
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        result = JSON.parse(body);
        res.send(result.data);
      } else if (error) {
        res.send(error);
      } else {
        res.send("There was a problem with the API.");
      }
    });
  } catch ({ response }) {
    return res.sendStatus(response.status);
  }
});
