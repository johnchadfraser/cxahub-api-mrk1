//Set router object.
const Router = require("express-promise-router");
const router = new Router();
const request = require("request");

//Export our router to be mounted by the parent application
module.exports = router;

//Get emarsys auth.
const auth = require("../auth");

const ep = "event/";

//Trigger event
router.post("/", async (req, res) => {
  try {
    //Set api url, auth header, and endpoint.
    const eurl = process.env.EMARSYS_API_URL;
    const eheader = {
      "X-WSSE": auth.getWsseHeader(
        process.env.EMARSYS_API_USER,
        process.env.EMARSYS_API_USER_SECRET
      ),
    };

    const { event_id, key_id, external_id, data } = req.body;

    const formData = {
      key_id: key_id,
      external_id: external_id,
      data: data,
    };

    //Build query for this api.
    let epq = event_id + "/trigger";

    //Set options for request.
    let options = {
      method: "POST",
      url: eurl + ep + epq,
      headers: eheader,
      body: formData,
      json: true,
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.status(response.statusCode).send({
          status: response.statusCode,
          success: "OK",
        });
      } else if (error) {
        res.status(400).send({
          status: response.statusCode,
          message: error,
          success: "NO",
        });
      } else {
        res.status(response.statusCode).send({
          status: response.statusCode,
          message: body,
          success: "NO",
        });
      }
    });
  } catch ({ response }) {
    return res.sendStatus(response.status);
  }
});
