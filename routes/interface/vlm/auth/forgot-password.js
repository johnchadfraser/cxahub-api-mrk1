//Set router object.
const Router = require("express-promise-router");
const router = new Router();
const request = require("request");

//Export our router to be mounted by the parent application
module.exports = router;

//Set api url, auth header, and endpoint.
const url = process.env.VLM_API_URL;
const header = {
  Authorization: process.env.VLM_API_AUTH,
  Username: process.env.VLM_API_USER,
  Password: process.env.VLM_API_USER_PASSWORD,
};

//Get all records.
router.get("/", async (req, res) => {
  try {
    const path =
      "/services/flash/sendresetlink?email=" +
      req.query["email"] +
      "&redirectUrl=" +
      req.query["redirectUrl"] +
      "&frgidf=" +
      req.query["redirectPath"];
    //Set options for request.
    let options = {
      method: "GET",
      url: url + path,
      headers: header,
      json: true,
    };

    //Get request.
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send("A reset link has been set to your email.");
      } else if (error) {
        res.send(error);
      } else {
        res.send("There was a problem with the API: " + error);
      }
    });
  } catch (error) {
    //Log and email the error.
    const logObj = {
      log_name: "CXAHUB API: VLM Forgot Password Error (Interface)",
      log_description: `An error occured in Forgot Password API GET: ${error.name} - ${error.message}`,
      logt_id: 3,
    };

    const emailObj = {
      subject: "CXAHUB API: VLM Forgot Password Error (Interface)",
      html: `<p>An error occured in VLM Forgot Password API GET: <br/><br/> <strong>${error.name}</strong><br/>${error.message}</p>`,
    };

    logService.addLog(logObj);
    emailService.smtpHandler(emailObj);

    res.send("An error occured in Forgot Password API GET: " + error);
  }
});
