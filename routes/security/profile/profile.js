//Set router object.
const Router = require("express-promise-router");
const router = new Router();

// Export our router to be mounted by the parent application
module.exports = router;

//Set DB connection and auth.
const db = require("../../../db");
const auth = require("../../../middleware/auth");
const { service } = require("../../../middleware/roles");

//Set messaging.
const updateSuccessMessage = "You have updated successfully.";

//Set services used by route.
const ProfileService = require("../../../services/security/profile/ProfileService");
const UserService = require("../../../services/user/UserService");
const EmarsysService = require("../../../services/interface/emarsys/EmarsysService");

//Enable wrap for async.
const wrap = require("express-async-wrap");

// Create record.
router.put(
  "/",
  [auth, service],
  wrap(async function (req, res) {
    try {
      const {
        user_id,
        user_first_name,
        user_last_name,
        user_email,
        user_company,
        ut_id,
        a_id,
        cntry_id,
        uf_id,
        ufr_value,
        bc_id,
        i_id,
        ftag_id,
        um_id,
        up_id,
        umpr_value,
      } = req.body;

      //Get IP.
      const user_ip =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;

      //Check if record exists.
      const checkExist = await UserService.findByEmail(user_email, 0);

      //If record exists, do not post.
      if (checkExist == "") {
        res.send(`The request you have made for ${user_email} does not exist!`);
      } else {
        //Update the user.
        await db.query(
          `UPDATE cxahub.t_user SET user_first_name = $2, user_last_name = $3, user_email = $1, user_company = $4, ut_id = $5, user_ip = $6, user_time_updated = now() WHERE user_email = $1`,
          [
            user_email,
            user_first_name,
            user_last_name,
            user_company,
            ut_id,
            user_ip,
          ]
        );

        //Update user address record.
        await ProfileService.updateUserAddressRel(user_id, a_id, cntry_id);

        //Update user field records.
        await ProfileService.updateUserFieldRel(user_id, uf_id, ufr_value);

        //Update user business channel records.
        await ProfileService.updateUserBusinessChannelRel(user_id, bc_id);

        //Update user industry records.
        await ProfileService.updateUserIndustryRel(user_id, i_id);

        //Update user forum tag records.
        await ProfileService.updateUserForumTagRel(user_id, ftag_id);

        //Update user member preference records.
        await ProfileService.updateUserMemberPreferenceRel(
          user_id,
          um_id,
          up_id,
          umpr_value
        );

        //Update user in Emarsys.
        await EmarsysService.updateRegistrationContact(
          user_first_name,
          user_last_name,
          user_email,
          user_company,
          cntry_id,
          bc_id,
          i_id,
          um_id,
          um_id,
          up_id,
          umpr_value
        );

        //Send an email confirmation.
        await ProfileService.sendEmailConfirmation(
          user_first_name,
          user_last_name,
          user_email
        );

        res.send(updateSuccessMessage);
      }
    } catch ({ response, error }) {
      console.error("An error occured in profile api:" + error.response.data);

      return res.sendStatus(response.status);
    }
  })
);