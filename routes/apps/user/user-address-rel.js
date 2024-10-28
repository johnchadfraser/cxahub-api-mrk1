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
const tableName = "cxahub.t_user_address_rel";
const viewName = "cxahub.v_user_address_rel";
const orderBy = "";

//Set messaging.
const createSuccessMessage =
  "You have created the user address rel. successfully.";
const deleteSuccessMessage =
  "You have deleted the user address rel. successfully.";

//Set services used by route.
const UserService = require("../../../services/user/UserService");
const UserAddressRelService = require("../../../services/user/UserAddressRelService");

//Enable wrap for async.
const wrap = require("express-async-wrap");
//Get all records. NO CACHE HERE!!!
router.get("/", [auth, service], async (req, res) => {
  //try {

  let qry = `SELECT * FROM ${viewName} WHERE 0=0`;

  if (req.query.user_id && req.query.a_id) {
    qry =
      qry +
      ` AND (user_id = '${req.query.user_id}' AND a_id = '${req.query.a_id}')`;
  }

  if (req.query.user_email) {
    qry =
      qry +
      ` AND (UPPER(user_email) = '${req.query.user_email.toUpperCase()}')`;
  }

  if (req.query.status_id) {
    qry = qry + ` AND status_id = '${req.query.status_id}'`;
  }

  if (orderBy != "") {
    qry = qry + ` ${orderBy}`;
  }

  const { rows } = await db.query(qry);
  res.send(rows);

  /*
  } catch ({ response, error }) {

    console.error("An error occured in user-address-rel GET api:" + error.response.data);

    return res.sendStatus(response.status);

  }
*/
});

// Get by id.
router.get("/:id", [auth, service], async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(`SELECT * FROM ${viewName} WHERE id = $1`, [
      id,
    ]);
    res.send(rows[0]);
  } catch ({ response, error }) {
    console.error(
      "An error occured in user-address-rel GET id api:" + error.response.data
    );

    return res.sendStatus(response.status);
  }
});

// Create record.
router.post(
  "/",
  [auth, service],
  wrap(async function (req, res) {
    //try {
    const { user_id, a_id } = req.body;

    //Check if record exists.
    const checkExist = await UserAddressRelService.findByUserAddress(
      user_id,
      a_id
    );

    //If record exists, do not post.
    if (checkExist != "") {
      res.send(`User address relationship already exists`);
    } else {
      await db.query(
        `INSERT INTO ${tableName} (user_id, a_id) VALUES ($1, $2) RETURNING *`,
        [user_id, a_id]
      );

      res.send(createSuccessMessage);
    }
    /*
    } catch ({ response, error }) {
      console.error(
        "An error occured in user-address-rel POST api:" + error.response.data
      );

      return res.sendStatus(response.status);
    }*/
  })
);

// Delete record.
router.delete("/:id", [auth, service], async (req, res) => {
  try {
    const id = req.params.id;
    await db.query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);

    res.send(deleteSuccessMessage);
  } catch ({ response, error }) {
    console.error(
      "An error occured in user-address-rel DELETE api:" + error.response.data
    );

    return res.sendStatus(response.status);
  }
});

// Delete record by user id.
router.delete("/user_id/:user_id", [auth, service], async (req, res) => {
  try {
    const id = req.params.user_id;
    await db.query(`DELETE FROM ${tableName} WHERE user_id = $1`, [id]);

    res.send(deleteSuccessMessage);
  } catch ({ response, error }) {
    console.error(
      "An error occured in address DELETE id api:" + error.response.data
    );

    return res.sendStatus(response.status);
  }
});
