//Set router object.
const Router = require("express-promise-router");
const router = new Router();
const request = require("request");

//Export our router to be mounted by the parent application
module.exports = router;

//Set api url, auth header, and endpoint.
const url = process.env.VLM_API_URL;

const path = "/services/flash/getCustomerSurveyData";

//Get all records.
router.get("/", async (req, res) => {
  try {
    //Set options for request.
    let options = {
      method: "GET",
      url: url + path + "?customerSurveyId=" + req.query["customerSurveyId"],
      headers: { "x-auth-token": req.query["x-auth-token"] },
      json: true,
    };

    //Get request.
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        if (req.query.group && req.query.question) {
          res.send(
            body.results.areas[req.query.group].groups[req.query.question]
          );
        } else if (req.query.questions) {
          res.send(body.results.areas);
        } else if (req.query.completedpercentage) {
          res.send(
            body.results.preSurveyAssets.completionstatus.completionpercentage
          );
        } else {
          res.send(body);
        }
      } else if (error) {
        res.send(error);
      } else {
        res.send("There was a problem with the API: " + body.err);
      }
    });
  } catch (error) {
    //Log and email the error.
    const logObj = {
      log_name: "CXAHUB API: VLM Survey Error (Interface)",
      log_description: `An error occured in Survey API GET: ${error.name} - ${error.message}`,
      logt_id: 3,
    };

    const emailObj = {
      subject: "CXAHUB API: VLM Survey Error (Interface)",
      html: `<p>An error occured in VLM Survey API GET: <br/><br/> <strong>${error.name}</strong><br/>${error.message}</p>`,
    };

    logService.addLog(logObj);
    emailService.smtpHandler(emailObj);

    res.send("An error occured in Survey API GET: " + error);
  }
});
