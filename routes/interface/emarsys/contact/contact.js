//Set router object.
const Router = require("express-promise-router");
const router = new Router();
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
    let epq = "/getdata";

    //Set options for request.
    let options = {
      method: "POST",
      url: eurl + ep + epq,
      headers: eheader,
      body: {
        keyId: 3,
        fields: [3],
        keyValues: [req.query.email],
      },
      json: true,
    };

    //Get request.
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(true);
      } else if (error) {
        res.send(error);
      } else {
        res.send(body.data.result);
      }
    });
  } catch (error) {
    //Log and email the error.
    const logObj = {
      log_name: "CXAHUB API: Emarsys Contact Error (Interface)",
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
      u_type_id,
      um_id,
      cntry_id,
      user_company,
      register_source,
    } = req.body;

    let formData = {};

    if (register_source === "Firestarters") {
      const opt_in_firestarters = 1;
      formData = {
        8897: user_id,
        1: user_first_name,
        2: user_last_name,
        3: user_email,
        8878: u_type_id, //Employee or Customer by id
        8877: um_id, //User Member id's
        14: parseInt(cntry_id),
        18: user_company,
        8881: opt_in_firestarters,
      };
    } else if (register_source === "Flash") {
      const opt_in_flash = 1;
      formData = {
        8897: user_id,
        1: user_first_name,
        2: user_last_name,
        3: user_email,
        8878: u_type_id, //Employee or Customer by id
        8877: um_id, //User Member id's
        14: parseInt(cntry_id),
        18: user_company,
        12494: opt_in_flash,
      };
    }

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
        res.send("There was a problem with the API: " + body);
      }
    });
  } catch (error) {
    //Log and email the error.
    const logObj = {
      log_name: "CXAHUB API: Emarsys Contact Error (Interface)",
      log_description: `An error occured in Contact API POST: ${error.name} - ${error.message}`,
      logt_id: 3,
    };

    const emailObj = {
      subject: "CXAHUB API: Emarsys Contact Error (Interface)",
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
      bc_id,
      i_id,
      um_id,
      up_id,
      umpr_value,
    } = req.body;

    //Get the erpr_id based on cntry_id.
    const erpr_id = await EmarsysService.getERPByCountry(cntry_id);

    //Determine the member preference relationships.
    let opt_in_firestarters = 1;

    for (let i in um_id) {
      let current_um_id = um_id[i];

      for (let ii in up_id) {
        //Opt-in control for Firestarters.
        if (current_um_id == 2) {
          opt_in_firestarters = umpr_value[ii];
        }
      }
    }

    const formData = {
      key_id: "3",
      1: user_first_name,
      2: user_last_name,
      3: user_email,
      8877: [um_id], //User Member id's
      14: cntry_id,
      8879: [erpr_id],
      18: user_company,
      8876: [bc_id],
      8880: [i_id],
      8881: opt_in_firestarters,
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
      log_name: "CXAHUB API: Emarsys Contact Error (Interface)",
      log_description: `An error occured in Contact API PUT: ${error.name} - ${error.message}`,
      logt_id: 3,
    };

    const emailObj = {
      subject: "CXAHUB API: Emarsys Contact Error (Interface)",
      html: `<p>An error occured in Contact API PUT: <br/><br/> <strong>${error.name}</strong><br/>${error.message}</p>`,
    };

    logService.addLog(logObj);
    emailService.smtpHandler(emailObj);

    res.send("An error occured in Contact API PUT: " + error);
  }
});

// Update record.
router.put("/update", async (req, res) => {
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
      u_type_id,
      um_id,
      cntry_id,
      user_company,
      register_source,
    } = req.body;

    let formData = {};

    if (register_source === "Firestarters") {
      const opt_in_firestarters = 1;
      formData = {
        key_id: "3",
        8897: user_id,
        1: user_first_name,
        2: user_last_name,
        3: user_email,
        8878: u_type_id, //Employee or Customer by id
        8877: um_id, //User Member id's
        14: parseInt(cntry_id),
        18: user_company,
        31: parseInt(1),
        8881: opt_in_firestarters,
      };
    } else if (register_source === "Flash") {
      const opt_in_flash = 1;
      formData = {
        key_id: "3",
        8897: user_id,
        1: user_first_name,
        2: user_last_name,
        3: user_email,
        8878: u_type_id, //Employee or Customer by id
        8877: um_id, //User Member id's
        14: parseInt(cntry_id),
        18: user_company,
        31: parseInt(1),
        12494: opt_in_flash,
      };
    }

    //Set options for request.
    let options = {
      method: "PUT",
      url: eurl + ep + "/?create_if_not_exists=1",
      headers: eheader,
      body: formData,
      json: true,
    };

    request(options, function (error, response, body) {
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
      log_name: "CXAHUB API: Emarsys Contact Error (Interface)",
      log_description: `An error occured in Contact API PUT: ${error.name} - ${error.message}`,
      logt_id: 3,
    };

    const emailObj = {
      subject: "CXAHUB API: Emarsys Contact Error (Interface)",
      html: `<p>An error occured in Contact API PUT: <br/><br/> <strong>${error.name}</strong><br/>${error.message}</p>`,
    };

    logService.addLog(logObj);
    emailService.smtpHandler(emailObj);

    res.send("An error occured in Contact API PUT: " + error);
  }
});

// Delete record by user id.
router.delete("/delete/user_email/:user_email", async (req, res) => {
  try {
    const eheader = {
      "X-WSSE": auth.getWsseHeader(
        process.env.EMARSYS_API_USER,
        process.env.EMARSYS_API_USER_SECRET
      ),
    };

    const user_email = req.params.user_email;

    const formData = {
      key_id: "3",
      3: user_email,
    };

    //Set options for request.
    let options = {
      method: "POST",
      url: eurl + ep + "/delete",
      headers: eheader,
      body: formData,
      json: true,
    };

    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.send(response);
      } else if (error) {
        res.send(error);
      } else {
        res.send("There was a problem with the API. Or no record was found.");
      }
    });
  } catch (error) {
    //Log and email the error.
    const logObj = {
      log_name: "CXAHUB API: Emarsys Contact Error (Interface)",
      log_description: `An error occured in Contact API DELETE: ${error.name} - ${error.message}`,
      logt_id: 3,
    };

    const emailObj = {
      subject: "CXAHUB API: Emarsys Contact Error (Interface)",
      html: `<p>An error occured in Contact API DELETE: <br/><br/> <strong>${error.name}</strong><br/>${error.message}</p>`,
    };

    logService.addLog(logObj);
    emailService.smtpHandler(emailObj);

    res.send("An error occured in Contact API DELETE: " + error);
  }
});
