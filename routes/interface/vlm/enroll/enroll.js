//Set router object.
const Router = require("express-promise-router");
const router = new Router();
const request = require("request");

//Export our router to be mounted by the parent application
module.exports = router;

//Set api url, auth header, and endpoint.
const url = process.env.VLM_API_URL;

const path = "/services/flash/enrollLoadSurvey";

//Get all records.
router.post("/", async (req, res) => {
  try {
    //Set options for request.
    let options = {
      method: "POST",
      url: url + path,
      headers: { "x-auth-token": req.query["x-auth-token"] },
      body: req.body,
      json: true,
    };

    //Get request.
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        if (req.query.question) {
          //res.send(body.results.areas[0].groups[req.query.question]);
          res.send(body.results.areas);
        } else if (req.query.ungroupedquestions) {
          res.send(body.results.areas[0].groups);
        } else if (req.query.groupedquestions) {
          res.send(body.results.areas);
        } else {
          res.send(body);
        }
      } else if (error) {
        res.send(error);
      } else {
        res.send("There was a problem with the API: " + error);
      }
    });
  } catch (error) {
    //Log and email the error.
    const logObj = {
      log_name: "CXAHUB API: VLM Enroll Error (Interface)",
      log_description: `An error occured in Enroll API POST: ${error.name} - ${error.message}`,
      logt_id: 3,
    };

    const emailObj = {
      subject: "CXAHUB API: VLM Enroll Error (Interface)",
      html: `<p>An error occured in VLM Enroll API POST: <br/><br/> <strong>${error.name}</strong><br/>${error.message}</p>`,
    };

    logService.addLog(logObj);
    emailService.smtpHandler(emailObj);

    res.send("An error occured in Enroll API POST: " + error);
  }
});
