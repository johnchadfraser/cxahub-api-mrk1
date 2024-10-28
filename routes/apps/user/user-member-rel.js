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
const tableName = "cxahub.t_user_member_rel";
const viewName = "cxahub.v_user_member_rel";
const orderBy = "";

//Set messaging.
const createSuccessMessage =
  "You have created the user member rel. successfully.";
const deleteSuccessMessage =
  "You have deleted the user member rel. successfully.";

//Set services used by route.
//const UserMemberRelService = require('../../../services/user/UserMemberRelService');
const UserService = require("../../../services/user/UserService");

//Enable wrap for async.
const wrap = require("express-async-wrap");
//Get all records. NO CACHE HERE!!!
router.get("/", [auth, service], async (req, res) => {
  try {
    let qry = `SELECT * FROM ${viewName} WHERE 0=0`;

    if (req.query.user_id && req.query.um_id) {
      qry =
        qry +
        ` AND (user_id = '${req.query.user_id}' AND um_id = '${req.query.um_id}')`;
    }

    if (req.query.user_id) {
      qry = qry + ` AND user_id = '${req.query.user_id}'`;
    }

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
    const { user_id, um_id } = req.body;

    //First delete any existing relationship records.
    await UserService.deleteUserMemberRel(user_id);

    //Loop order list of um_id's
    for (let i = 0; i < um_id.length; i++) {
      await db.query(
        `INSERT INTO ${tableName} (user_id, um_id) VALUES ($1, $2) RETURNING *`,
        [user_id, um_id[i]]
      );
    }

    res.send(createSuccessMessage);
  })
);

// Delete record.
router.delete("/:id", [auth, service], async (req, res) => {
  const id = parseInt(req.params.id);
  await db.query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);

  res.send(deleteSuccessMessage);
});

// Delete record by user id.
router.delete("/user_id/:user_id", [auth, service], async (req, res) => {
  const id = req.params.user_id;
  await db.query(`DELETE FROM ${tableName} WHERE user_id = $1`, [id]);

  res.send(deleteSuccessMessage);
});
