//Set router object.
const Router = require("express-promise-router");
const router = new Router();
const apicache = require("apicache");
let cache = apicache.middleware;
const cachMins = "20 minutes";

// Export our router to be mounted by the parent application
module.exports = router;

//Set DB connection and auth.
const db = require("../../../db");
const auth = require("../../../middleware/auth");
const { service } = require("../../../middleware/roles");

//Set table and view names plus any default query variables.
const tableName = "cxahub.t_user";

//Set messaging.
const createSuccessMessage = "You have registered successfully.";

//Set services used by route.
const RegisterService = require("../../../services/security/register/RegisterService");
const UserService = require("../../../services/user/UserService");
const UserMemberRelService = require("../../../services/user/UserMemberRelService");
const EmarsysService = require("../../../services/interface/emarsys/EmarsysService");

//Enable wrap for async.
const wrap = require("express-async-wrap");

function removeDuplicates(arr) {
  return [...new Set(arr)];
}

// Create record.
router.post(
  "/",
  [auth, service],
  wrap(async function (req, res) {
    let {
      user_first_name,
      user_last_name,
      user_email,
      user_company,
      cntry_id,
      user_password,
      register_source,
      email_confirmation,
    } = req.body;

    let id = 0;
    let um_id = 0;
    let umIDList = [];

    //Get IP.
    const user_ip =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;

    //Check if record exists.
    const checkExist = await UserService.findByEmail(user_email, 0);

    //Check user type based on email.
    if (user_email.includes("@sap.com")) {
      u_type_id = 1;
      ur_id = 3;
    } else {
      u_type_id = 2;
      ur_id = 5;
    }

    const up_id = "1,2";
    const umpr_value = "TRUE,TRUE";

    if (checkExist === undefined || checkExist.length == 0) {
      const { rows } = await db.query(
        `INSERT INTO ${tableName} (user_first_name, user_last_name, user_email, user_company, user_ip, u_type_id, ur_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          user_first_name,
          user_last_name,
          user_email,
          user_company,
          user_ip,
          u_type_id,
          ur_id,
        ]
      );
      id = rows[0].id;
    } else {
      id = checkExist[0].id;
      //Flash Company Name Rule
      if (register_source === "Flash") {
        user_company = checkExist[0].user_company;
      }
    }

    //Create relationship records.
    await UserService.addUserSecurityKeyRel(id, user_password);

    //Create an address record.
    if (cntry_id != 0) {
      const a_id = await RegisterService.addAddressCountry(
        id,
        parseInt(cntry_id)
      );

      //Create address relationship.
      await UserService.addUserAddressRel(id, a_id);
    }

    //Set membership and preferences.
    if (register_source === "Backoffice") {
      um_id = 1;
    } else if (register_source === "Firestarters") {
      um_id = 2;
    } else if (register_source === "Flash") {
      um_id = 3;
    } else {
      um_id = 2;
    }

    //Create relationship records if key is not 0.
    if (um_id != 0) {
      const userMemberRel = await UserMemberRelService.findByUserId(id);
      for (let i = 0; i < userMemberRel.length; i++) {
        umIDValue = parseInt(userMemberRel[i].um_id);
        umIDList.push(umIDValue);
      }

      //Push new um_id
      umIDList.push(parseInt(um_id));

      //Remove duplicate um_id's
      umIDList = removeDuplicates(umIDList);

      await UserService.addUserMemberRel(id, umIDList);
    }

    if (um_id != 0 && up_id != 0) {
      await UserService.addUserMemberPreferenceRel(
        id,
        um_id,
        up_id,
        umpr_value
      );
    }

    //Now set the um_id for Emarsys.
    um_id = umIDList;

    //Create user in Emarsys.
    await EmarsysService.addRegistrationContact(
      id,
      user_first_name,
      user_last_name,
      user_email,
      u_type_id,
      um_id,
      cntry_id,
      user_company,
      register_source
    );

    if (email_confirmation) {
      //Send an email confirmation.
      await RegisterService.sendEmailConfirmation(
        user_first_name,
        user_last_name,
        user_email,
        register_source
      );
    }

    if (!res.error && res.statusCode == 200) {
      res.status(res.statusCode).send({
        status: res.statusCode,
        success: "OK",
      });
    } else if (res.error) {
      res.status(400).send({
        status: res.statusCode,
        message: res.error,
        success: "NO",
      });
    } else {
      res.status(res.statusCode).send({
        status: res.statusCode,
        message: res.body,
        success: "NO",
      });
    }
  })
);
