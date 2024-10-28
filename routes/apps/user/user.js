//Set router object.
const Router = require("express-promise-router");
const router = new Router();

// Export our router to be mounted by the parent application
module.exports = router;

//Set DB connection and auth.
const db = require("../../../db");
const auth = require("../../../middleware/auth");
const { service } = require("../../../middleware/roles");

//Set table and view names plus any default query variables.
const tableName = "cxahub.t_user";
const viewName = "cxahub.v_user";
const orderBy = "ORDER BY sort_id ASC";

//Set messaging.
const createSuccessMessage = "You have created the user successfully.";
const updateSuccessMessage = "You have updated the user successfully.";
const deleteSuccessMessage = "You have deleted the user successfully.";

//Set services used by route.
const UserService = require("../../../services/user/UserService");

//Enable wrap for async.
const wrap = require("express-async-wrap");
//Get all records. NO CACHE HERE!!!
router.get("/", [auth, service], async (req, res) => {
  try {
    let qry = `SELECT * FROM ${viewName} WHERE 0=0`;

    //Filter by keywords.
    if (req.query.kw) {
      //Convert keywords into an array with a space delimeter.
      const kw_arr = req.query.kw.split(" ").map((element) => {
        return String(element);
      });

      //Check if is a valid array.
      if (Array.isArray(kw_arr)) {
        //Loop over keywords.
        kw_arr.forEach(function (keyword, index) {
          //Set operator for kw looped query.
          sqlOperator = "AND";
          if (index != 0) {
            sqlOperator = "OR";
          }

          qry =
            qry +
            ` ${sqlOperator} (UPPER(user_email) LIKE '%${keyword
              .trim()
              .toUpperCase()}%' 
          OR UPPER(user_first_name) LIKE '%${keyword.trim().toUpperCase()}%'
          OR UPPER(user_last_name) LIKE '%${keyword.trim().toUpperCase()}%'
          )`;
        });
      }
    }

    //Exclude user id.
    if (req.query.exclude_user_id) {
      qry = qry + ` AND id <> '${req.query.exclude_user_id}'`;
    }

    //Filter by employee id.
    if (req.query.emp_id) {
      qry = qry + ` AND emp_id = '${req.query.emp_id}'`;
    }

    //Filter by email.
    if (req.query.user_email) {
      qry =
        qry +
        ` AND UPPER(user_email) = '${req.query.user_email
          .trim()
          .toUpperCase()}'`;
    }

    //Filter by date of expiration.
    if (req.query.user_date_exp) {
      qry =
        qry +
        ` AND (user_date_exp > '${req.query.user_date_exp}' OR user_date_exp = '1900-01-01')`;
    }

    //Filter by user type.
    if (req.query.u_type_id) {
      qry = qry + ` AND u_type_id = '${req.query.u_type_id}'`;
    }

    //Filter by user role.
    if (req.query.ur_id) {
      qry = qry + ` AND ur_id = '${req.query.ur_id}'`;
    }

    //Filter by status.
    if (req.query.status_id) {
      qry = qry + ` AND status_id = '${req.query.status_id}'`;
    }

    //Order by.
    if (req.query.order_by) {
      qry = qry + ` ORDER BY ${req.query.order_by} ${req.query.sort}`;
    } else if (orderBy != "") {
      qry = qry + ` ${orderBy}`;
    }

    //Limit.
    if (req.query.limit) {
      qry = qry + ` LIMIT ${req.query.limit}`;
    }

    //Offset.
    if (req.query.offset) {
      qry = qry + ` OFFSET ${req.query.offset}`;
    }

    const { rows } = await db.query(qry);
    res.send(rows);
  } catch ({ response }) {
    return res.sendStatus(response.status);
  }
});

// Get by id.
router.get("/:id", [auth, service], async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(`SELECT * FROM ${viewName} WHERE id = $1`, [
      id,
    ]);
    res.send(rows[0]);
  } catch ({ response }) {
    return res.sendStatus(response.status);
  }
});

// Create record.
router.post(
  "/",
  [auth, service],
  wrap(async function (req, res) {
    const {
      emp_id,
      user_first_name,
      user_middle_name,
      user_last_name,
      user_email,
      user_company,
      user_password,
      user_telephone,
      user_telephone_mobile,
      user_telephone_alt,
      user_telephone_ext,
      user_date_exp,
      img_id,
      mc_id,
      ur_id,
      ut_id,
      user_id,
      sort_id,
      status_id,
      bc_id,
      i_id,
      erpr_id,
      um_id,
      up_id,
      umpr_value,
    } = req.body;

    //Get IP.
    const user_ip =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;

    //Check if record exists.
    const checkExist = await UserService.findByEmail(user_email, 0);

    //Check origin from domain.
    let checkEmailDomain = user_email.substring(user_email.indexOf("@") + 1);
    const restrictedEmailCheck =
      process.env.RESTRICTED_EMAIL.includes(checkEmailDomain);

    //Check restricted email addresses.
    if (restrictedEmailCheck) {
      res.send(
        `Please use a valid company/brand email address, we do not support free email clients or competitors email addresses.`
      );

      //If record exists, do not post.
    } else if (checkExist != "") {
      res.send(`User already exists: ${user_email}`);
    } else {
      //Check user type based on email.
      if (user_email.includes("@sap.com")) {
        u_type_id = 1;
      } else {
        u_type_id = 2;
      }

      const { rows } = await db.query(
        `INSERT INTO ${tableName} (emp_id, user_first_name, user_middle_name, user_last_name, user_email, user_company, user_telephone, user_telephone_mobile, user_telephone_alt, user_telephone_ext, user_date_exp, user_ip, u_type_id, img_id, mc_id, ur_id, ut_id, user_id, sort_id, status_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING *`,
        [
          emp_id,
          user_first_name,
          user_middle_name,
          user_last_name,
          user_email,
          user_company,
          user_telephone,
          user_telephone_mobile,
          user_telephone_alt,
          user_telephone_ext,
          user_date_exp,
          user_ip,
          u_type_id,
          img_id,
          mc_id,
          ur_id,
          ut_id,
          user_id,
          sort_id,
          status_id,
        ]
      );

      const id = rows[0].id;

      //Create relationship records.
      await UserService.addUserSecurityKeyRel(id, user_password);

      //Create relationship records if key is not 0.
      if (bc_id != 0) {
        await UserService.addUserBusinessChannelRel(id, bc_id);
      }

      if (i_id != 0) {
        await UserService.addUserIndustryRel(id, i_id);
      }

      if (erpr_id != 0) {
        await UserService.addUserERPRegionRel(id, erpr_id);
      }

      if (um_id != 0) {
        await UserService.addUserMemberRel(id, um_id);
      }

      if (um_id != 0 && up_id != 0) {
        await UserService.addUserMemberPreferenceRel(
          id,
          um_id,
          up_id,
          umpr_value
        );
      }

      res.send(createSuccessMessage);
    }
  })
);

// Update record.
router.put("/:id", [auth, service], async (req, res) => {
  const { id } = req.params;
  const {
    emp_id,
    user_first_name,
    user_middle_name,
    user_last_name,
    user_email,
    user_company,
    user_password,
    user_telephone,
    user_telephone_mobile,
    user_telephone_alt,
    user_telephone_ext,
    user_date_exp,
    img_id,
    mc_id,
    ur_id,
    ut_id,
    user_id,
    sort_id,
    status_id,
    bc_id,
    i_id,
    erpr_id,
    um_id,
    up_id,
    umpr_value,
  } = req.body;

  //Get IP.
  const user_ip =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;

  //Check if record exists.
  const checkExist = await UserService.findByEmail(user_email, id);

  //Check origin from domain.
  let checkEmailDomain = user_email.substring(user_email.indexOf("@") + 1);
  const restrictedEmailCheck =
    process.env.RESTRICTED_EMAIL.includes(checkEmailDomain);

  //Check restricted email addresses.
  if (restrictedEmailCheck) {
    res.send(
      `Please use a valid company/brand email address, we do not support free email clients or competitors email addresses.`
    );

    //If record exists, do not post.
  } else if (checkExist != "") {
    res.send(
      `User already exists: ${user_email}, please try again or try logging in.`
    );
  } else {
    //Check user type based on email.
    if (user_email.includes("@sap.com")) {
      u_type_id = 1;
    } else {
      u_type_id = 2;
    }

    const { rows } = await db.query(
      `UPDATE ${tableName} SET emp_id = $2, user_first_name = $3, user_middle_name = $4, user_last_name = $5, user_email = $6, user_company = $7, user_telephone = $8, user_telephone_mobile = $9, user_telephone_alt = $10, user_telephone_ext = $11, user_time_updated = now(), user_date_exp = $12, user_ip = $13, u_type_id = $14, img_id = $15, mc_id = $16, ur_id = $17, ut_id = $18, user_id = $19, sort_id = $20, status_id = $21 WHERE id = $1`,
      [
        id,
        emp_id,
        user_first_name,
        user_middle_name,
        user_last_name,
        user_email,
        user_company,
        user_telephone,
        user_telephone_mobile,
        user_telephone_alt,
        user_telephone_ext,
        user_date_exp,
        user_ip,
        u_type_id,
        img_id,
        mc_id,
        ur_id,
        ut_id,
        user_id,
        sort_id,
        status_id,
      ]
    );

    //Create relationship records.
    await UserService.addUserSecurityKeyRel(id, user_password);

    //Create relationship records if key is not 0.
    if (bc_id != 0) {
      await UserService.addUserBusinessChannelRel(id, bc_id);
    }

    if (i_id != 0) {
      await UserService.addUserIndustryRel(id, i_id);
    }

    if (erpr_id != 0) {
      await UserService.addUserERPRegionRel(id, erpr_id);
    }

    if (um_id != 0) {
      await UserService.addUserMemberRel(id, um_id);
    }

    if (um_id != 0 && up_id != 0) {
      await UserService.addUserMemberPreferenceRel(
        id,
        um_id,
        up_id,
        umpr_value
      );
    }

    res.send(updateSuccessMessage);
  }
});

// Delete record.
router.delete(
  "/:id",
  [auth, service],
  wrap(async function (req, res) {
    const { id } = req.params;

    //Delete relationship records.
    await UserService.deleteUserAddressRel(id);
    await UserService.deleteUserSecurityKeyRel(id);
    await UserService.deleteUserBusinessChannelRel(id);
    await UserService.deleteUserIndustryRel(id);
    await UserService.deleteUserERPRegionRel(id);
    await UserService.deleteUserMemberRel(id);
    await UserService.deleteUserMemberPreferenceRel(id);
    await UserService.deleteUserCommentLikeUserRel(id);
    await UserService.deleteUserCommentShareUserRel(id);
    await UserService.deleteUserComment(id);

    const { rows } = await db.query(`DELETE FROM ${tableName} WHERE id = $1`, [
      id,
    ]);

    res.send(deleteSuccessMessage);
  })
);
