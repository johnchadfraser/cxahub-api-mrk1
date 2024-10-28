//Set router object.
const Router = require("express-promise-router");
const router = new Router();
const request = require("request");
const axios = require("axios");

//Export our router to be mounted by the parent application
module.exports = router;

//Set api url, auth header, and endpoint.
const url = process.env.VLM_API_URL;

const path = "/pptservice/api/FLASHPPT";

//Get all records.
router.get("/", async (req, res) => {
  try {
    //Check if the survey exists.
    const checkExists = await axios
      .get(`${url}/services/flash/getCustomerSurveyData`, {
        params: {
          customerSurveyId: req.query["surveyId"],
        },
        headers: { "x-auth-token": req.query["x-auth-token"] },
      })

      .catch(function (error) {
        if (error.response) {
          res.send({
            success: false,
          });
          return;
        }
      });

    if (checkExists) {
      //Set options for request.
      let options = {
        method: "GET",
        url: url + path + "?surveyId=" + req.query["surveyId"],
        headers: {
          "Content-Disposition":
            "attachment; filename=Flash.pptx; filename*=UTF-8''Flash.pptx",
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "x-auth-token": req.query["x-auth-token"],
        },
      };

      //Get request.
      request(options, function (error, response, body) {}).pipe(res);

      return;
    }
  } catch (error) {
    //Log and email the error.
    const logObj = {
      log_name: "CXAHUB API: VLM Download Error (Interface)",
      log_description: `An error occured in Download API GET: ${error.name} - ${error.message}`,
      logt_id: 3,
    };

    const emailObj = {
      subject: "CXAHUB API: VLM Download Error (Interface)",
      html: `<p>An error occured in VLM Download API GET: <br/><br/> <strong>${error.name}</strong><br/>${error.message}</p>`,
    };

    logService.addLog(logObj);
    emailService.smtpHandler(emailObj);

    res.send("An error occured in Download API GET: " + error);
  }
});
