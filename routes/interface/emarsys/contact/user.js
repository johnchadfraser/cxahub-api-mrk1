//Set router object.
const Router = require("express-promise-router");
const router = new Router();
const apicache = require("apicache");
let cache = apicache.middleware;
const cachMins = "20 minutes";
const request = require("request");

//Export our router to be mounted by the parent application
module.exports = router;

//Set services used by route.
const EmarsysService = require("../../../../services/interface/emarsys/EmarsysService");

//Get emarsys auth.
const auth = require("../auth");

//Set api url, auth header, and endpoint.
const eurl = process.env.EMARSYS_API_URL;

const ep = "contact";
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
    let epq = "/query/?return=3";

    //Set options for request.
    let options = {
      method: "GET",
      url: eurl + ep + epq,
      headers: eheader,
      json: true,
    };

    //Get request.
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(body.data.result);
      } else if (error) {
        res.send(error);
      } else {
        res.send("There was a problem with the API.");
      }
    });
  } catch (error) {
    //Log and email the error.
    const logObj = {
      log_name: "CXAHUB API: Emarsys Contact User Error (Interface)",
      log_description: `An error occured in Contact API GET: ${error.name} - ${error.message}`,
      logt_id: 3,
    };

    const emailObj = {
      subject: "CXAHUB API: Emarsys Contact Error (Interface)",
      html: `<p>An error occured in Contact API GET: <br/><br/> <strong>${error.name}</strong><br/>${error.message}</p>`,
    };

    logService.addLog(logObj);
    emailService.smtpHandler(emailObj);

    res.send("An error occured in Contact API GET: " + error);
  }
});

// Create record.
router.post("/", async (req, res) => {
  try {
    const eheader = {
      "X-WSSE": auth.getWsseHeader(
        process.env.EMARSYS_API_USER,
        process.env.EMARSYS_API_USER_SECRET
      ),
    };

    const {
      user_id,
      user_first_name,
      user_last_name,
      user_email,
      user_company,
      cntry_id,
    } = req.body;

    const formData = {
      8897: user_id,
      1: user_first_name,
      2: user_last_name,
      3: user_email,
      18: user_company,
      14: cntry_id,
    };

    //Set options for request.
    let options = {
      method: "POST",
      url: eurl + ep,
      headers: eheader,
      body: formData,
      json: true,
    };

    request.post(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(body);
      } else if (error) {
        res.send(error);
      } else {
        res.send("There was a problem with the API: " + error);
      }
    });
  } catch (error) {
    //Log and email the error.
    const logObj = {
      log_name: "CXAHUB API: Emarsys Contact User Error (Interface)",
      log_description: `An error occured in Contact User API POST: ${error.name} - ${error.message}`,
      logt_id: 3,
    };

    const emailObj = {
      subject: "CXAHUB API: Emarsys Contact User Error (Interface)",
      html: `<p>An error occured in Contact API POST: <br/><br/> <strong>${error.name}</strong><br/>${error.message}</p>`,
    };

    logService.addLog(logObj);
    emailService.smtpHandler(emailObj);

    res.send("An error occured in Contact API POST: " + error);
  }
});

// Update record.
router.put("/", async (req, res) => {
  try {
    const eheader = {
      "X-WSSE": auth.getWsseHeader(
        process.env.EMARSYS_API_USER,
        process.env.EMARSYS_API_USER_SECRET
      ),
    };

    const {
      user_first_name,
      user_last_name,
      user_email,
      user_company,
      cntry_id,
    } = req.body;

    //Get the erpr_id based on cntry_id.
    const erpr_id = await EmarsysService.getERPByCountry(cntry_id);

    const formData = {
      key_id: "3",
      1: user_first_name,
      2: user_last_name,
      3: user_email,
      18: user_company,
      14: cntry_id,
      8879: [erpr_id],
    };

    //Set options for request.
    let options = {
      method: "PUT",
      url: eurl + ep,
      headers: eheader,
      body: formData,
      json: true,
    };

    request.put(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(response);
      } else if (error) {
        res.send(error);
      } else {
        res.send("There was a problem with the API.");
      }
    });
  } catch (error) {
    //Log and email the error.
    const logObj = {
      log_name: "CXAHUB API: Emarsys Contact User Error (Interface)",
      log_description: `An error occured in Contact User API PUT: ${error.name} - ${error.message}`,
      logt_id: 3,
    };

    const emailObj = {
      subject: "CXAHUB API: Emarsys Contact User Error (Interface)",
      html: `<p>An error occured in Contact API PUT: <br/><br/> <strong>${error.name}</strong><br/>${error.message}</p>`,
    };

    logService.addLog(logObj);
    emailService.smtpHandler(emailObj);

    res.send("An error occured in Contact API PUT: " + error);
  }
});
