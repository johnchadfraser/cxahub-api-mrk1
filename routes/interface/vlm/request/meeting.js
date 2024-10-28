//Set router object.
const Router = require("express-promise-router");
const router = new Router();
const axios = require("axios");

//Export our router to be mounted by the parent application
module.exports = router;

//Get all records.
router.post("/", async (req, res) => {
  try {
    const flashWebsiteURL = process.env.FLASH_WEBSITE_URL;
    const to = process.env.FLASH_EMAIL;
    const from = process.env.SMTP_EMAIL;
    const subject =
      req.body.emailSubject +
      " from " +
      req.body.firstName +
      " " +
      req.body.lastName +
      " of " +
      req.body.companyName;
    if (req.body.comments != "") {
      html =
        "<br/><br/>" +
        req.body.emailBody +
        "<br/><br/>" +
        req.body.comments +
        "<br/><br/>" +
        `<a href="${flashWebsiteURL}/download/?surveyId=${req.body.surveyID}&companyName=${req.body.companyName}">Sign In to Download Report</a>` +
        "<br/><br/>" +
        req.body.emailSignature;
    } else {
      html =
        "<br/><br/>" +
        req.body.emailBody +
        "<br/><br/>" +
        `<a href="${flashWebsiteURL}/download/?surveyId=${req.body.surveyID}&companyName=${req.body.companyName}">Sign In to Download Report</a>` +
        "<br/><br/>" +
        req.body.emailSignature;
    }

    //Call the email API.
    await axios.post(`${apiURL}/email`, {
      to: to,
      from: from,
      subject: subject,
      html: html,
    });

    res.send({
      success: true,
    });
  } catch (error) {
    //Log and email the error.
    const logObj = {
      log_name: "CXAHUB API: VLM Request Meeting Error (Interface)",
      log_description: `An error occured in Request Meeting API POST: ${error.name} - ${error.message}`,
      logt_id: 3,
    };

    const emailObj = {
      subject: "CXAHUB API: VLM Request Meeting Error (Interface)",
      html: `<p>An error occured in VLM Request Meeting API POST: <br/><br/> <strong>${error.name}</strong><br/>${error.message}</p>`,
    };

    logService.addLog(logObj);
    emailService.smtpHandler(emailObj);

    res.send("An error occured in Request Meeting API POST: " + error);
  }
});
