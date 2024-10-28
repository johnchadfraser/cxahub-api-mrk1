//Set router object.
const Router = require("express-promise-router");
const router = new Router();

//Export our router to be mounted by the parent application
module.exports = router;

//Set DB connection and auth.
const db = require("../../../db");
const auth = require("../../../middleware/auth");
const { service } = require("../../../middleware/roles");

//Set table and view names plus any default query variables.
const tableName = "cxahub.t_user_security_key_rel";
const viewName = "cxahub.v_user_security_key_rel";
const orderBy = "ORDER BY sort_id ASC";

//Set messaging.
const createSuccessMessage = "You have successfully reset your password.";

//Set services used by route.
const UserService = require("../../../services/user/UserService");
const UserSecurityKeyRelService = require("../../../services/user/UserSecurityKeyRelService");

//Enable wrap for async.
const wrap = require("express-async-wrap");

//Get password record.
router.post("/", [auth, service], async (req, res) => {
  const { user_email, user_password, sk_value, user_date_exp, status_id } =
    req.body;

  //Check if record exists.
  const checkExist = await UserService.findUserSecurityKeyByEmail(
    user_email,
    sk_value,
    user_date_exp,
    status_id
  );

  if (checkExist == "") {
    res.send(
      `An error occurred, no user record found. Please contact support.`
    );
  } else {
    const user_id = checkExist[0].user_id;
    const user_email = checkExist[0].user_email;
    const sk_id = checkExist[0].sk_id;

    //Delete existing user security key data.
    await UserService.deleteUserSecurityKeyRel(user_id);

    //Delete security key.
    await UserSecurityKeyRelService.deleteUserSecurityKey(sk_id);

    //Create user security key relationship records.
    await UserService.addUserSecurityKeyRel(user_id, user_password);

    res.send(createSuccessMessage);
  }
});
