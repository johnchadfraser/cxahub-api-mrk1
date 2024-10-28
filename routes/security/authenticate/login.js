//Set router object.
const Router = require("express-promise-router");
const router = new Router();

//Set DB connection and auth.
const db = require("../../../db");
const auth = require("../../../middleware/auth");
const { service } = require("../../../middleware/roles");
const bcrypt = require("bcryptjs");

//Set table and view names plus any default query variables.
const tableName = "cxahub.t_user";

//Set messaging.
const createSuccessMessage = "You have Signed In successfully.";

//Set services used by route.
const UserService = require("../../../services/user/UserService");
const UserSecurityKeyRelService = require("../../../services/user/UserSecurityKeyRelService");
const RegisterService = require("../../../services/security/register/RegisterService");

//Enable wrap for async.
const wrap = require("express-async-wrap");

//Export our router to be mounted by the parent application
module.exports = router;

// Create record.
router.post(
  "/",
  [auth, service],
  wrap(async function (req, res) {
    const { user_email, user_password, user_date_exp, status_id } = req.body;

    //Check if record exists.
    const checkExist = await UserService.findByEmail(user_email, 0);

    //Get password security key.
    const user_security_key =
      await UserSecurityKeyRelService.findUserSecurityKeyByLogin(
        user_email,
        user_date_exp,
        status_id
      );

    //If email/user does not exist.
    if (checkExist.length === 0) {
      res.send(
        `This email is not registered with ${user_email} please Sign Up.`
      );
    } else {
      // Compare the password with the password in the database.
      const valid = await bcrypt.compare(
        user_password,
        user_security_key[0].sk_value
      );

      if (!valid) {
        res.send(
          "Your password is incorrect. If you cannot remember your password, please use the Forgot Password link."
        );
      } else {
        //Register the user for CXAHUB and Emarsys.
        RegisterService.addUserRegisterFromSignIn(req.body);
        res.send("true");
      }
    }
  })
);
