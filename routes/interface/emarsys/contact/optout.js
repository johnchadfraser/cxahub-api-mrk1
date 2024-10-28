//Set router object.
const Router = require("express-promise-router");
const router = new Router();
const request = require("request");

//Export our router to be mounted by the parent application
module.exports = router;

//Get emarsys auth.
const auth = require("../auth");

//Set services used by route.
const UserService = require("../../../../services/user/UserService");

//Set api url, auth header, and endpoint.
const eurl = process.env.EMARSYS_API_URL;

const ep = "contact";

// Update record.
router.put("/", async (req, res) => {
  try {
    const eheader = {
      "X-WSSE": auth.getWsseHeader(
        process.env.EMARSYS_API_USER,
        process.env.EMARSYS_API_USER_SECRET
      ),
    };

    const { user_email, um_id, opt_value } = req.body;

    formData = {};
    umpr_value = "";
    const up_id = 1;

    //Get the user_id.
    userData = await UserService.findByEmail(user_email, 0);

    //up_id value
    if (opt_value == 2) {
      umpr_value = 1;
    }

    //Firestarters
    if (um_id == 2) {
      formData = {
        key_id: "3",
        3: user_email,
        8881: opt_value,
      };

      //Flash
    } else if (um_id == 3) {
      formData = {
        key_id: "3",
        3: user_email,
        12494: opt_value,
      };

      //Other
    } else {
      formData = {
        key_id: "3",
        3: user_email,
        31: opt_value,
      };
    }

    //Set options for request.
    let options = {
      method: "PUT",
      url: eurl + ep,
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

    //Now update user data.

    if (userData[0]) {
      await UserService.deleteUserMemberPreferenceRelByIDs(
        userData[0].id,
        um_id,
        up_id
      );
      await UserService.addUserMemberPreferenceRel(
        userData[0].id,
        um_id.toString(),
        up_id.toString(),
        umpr_value.toString()
      );
    }
  } catch (error) {
    //Log and email the error.
    const logObj = {
      log_name: "CXAHUB API: Emarsys Contact Custom Opt-out Error (Interface)",
      log_description: `An error occured in Contact Custom Opt-out API PUT: ${error.name} - ${error.message}`,
      logt_id: 3,
    };

    const emailObj = {
      subject: "CXAHUB API: Emarsys Contact Custom Opt-out Error (Interface)",
      html: `<p>An error occured in Contact Custom Opt-out API PUT: <br/><br/> <strong>${error.name}</strong><br/>${error.message}</p>`,
    };

    logService.addLog(logObj);
    emailService.smtpHandler(emailObj);

    res.send("An error occured in Contact Custom Opt-out API PUT: " + error);
  }
});
