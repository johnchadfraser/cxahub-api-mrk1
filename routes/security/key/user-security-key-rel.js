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
const tableName = "cxahub.t_user_security_key_rel";
const viewName = "cxahub.v_user_security_key_rel";
const orderBy = "ORDER BY id DESC";

//Set messaging.
const createSuccessMessage =
  "You have created the user security key rel. successfully.";
const deleteSuccessMessage =
  "You have deleted the user security key rel. successfully.";

//Set services used by route.
const UserSecurityKeyRelService = require("../../../services/user/UserSecurityKeyRelService");
const UserService = require("../../../services/user/UserService");

//Enable wrap for async.
const wrap = require("express-async-wrap");
//Get all records.
router.get("/", [auth, service], async (req, res) => {
  try {
    let qry = `SELECT * FROM ${viewName} WHERE 0=0`;

    if (req.query.user_id) {
      qry = qry + ` AND (user_id = '${req.query.user_id}')`;
    }

    //Filter by email.
    if (req.query.user_email) {
      qry = qry + ` AND (user_email = '${req.query.user_email}')`;
    }

    //Filter by date of expiration.
    if (req.query.user_date_exp) {
      qry =
        qry +
        ` AND (user_date_exp > '${req.query.user_date_exp}' OR user_date_exp = '1900-01-01')`;
    }

    //Filter by security key value.
    if (req.query.sk_value) {
      qry = qry + ` AND (sk_value = '${req.query.sk_value}')`;
    }

    //Filter by status.
    if (req.query.status_id) {
      qry = qry + ` AND status_id = '${req.query.status_id}'`;
    }

    if (orderBy != "") {
      qry = qry + ` ${orderBy}`;
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
    const { user_id, sk_id } = req.body;

    //First delete any existing relationship records.
    await UserService.deleteUserSecurityKeyRel(user_id);

    await db.query(
      `INSERT INTO ${tableName} (user_id, sk_id) VALUES ($1, $2) RETURNING *`,
      [user_id, sk_id]
    );

    res.send(createSuccessMessage);
  })
);

// Delete record.
router.delete("/:id", [auth, service], async (req, res) => {
  const id = req.params.id;
  await db.query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);

  res.send(deleteSuccessMessage);
});

// Delete record by user id.
router.delete(
  "/user_id/:user_id",
  [auth, service],
  wrap(async function (req, res) {
    const id = req.params.user_id;

    await db.query(`DELETE FROM ${tableName} WHERE user_id = $1`, [id]);

    res.send(deleteSuccessMessage);
  })
);
