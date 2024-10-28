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
const tableName = "cxahub.t_content_author_user_rel";
const viewName = "cxahub.v_content_author_user_rel";
const orderBy = "";

//Set messaging.
const createSuccessMessage =
  "You have created the content author user rel. successfully.";
const deleteSuccessMessage =
  "You have deleted the content author user rel. successfully.";

//Set services used by route.
const ContentService = require("../../../services/content/ContentService");

//Enable wrap for async.
const wrap = require("express-async-wrap");
//Get all records.
router.get("/", [auth, service], async (req, res) => {
  try {
    let qry = `SELECT * FROM ${viewName} WHERE 0=0`;

    //Id.
    if (req.query.id) {
      qry = qry + ` AND id = '${req.query.id}'`;
    }

    //Content id.
    if (req.query.c_id) {
      qry = qry + ` AND c_id = '${req.query.c_id}'`;
    }

    //Filter by content author user.
    if (req.query.user_id) {
      qry = qry + ` AND user_id = ${req.query.user_id}`;
    }

    //Filter by status.
    if (req.query.status_id) {
      qry = qry + ` AND status_id = '${req.query.status_id}'`;
    }

    //Order by.
    if (req.query.order_by) {
      qry = qry + ` ORDER BY ${req.query.order_by}`;
    } else if (orderBy != "") {
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
    const { c_id, user_id } = req.body;

    //First delete any existing relationship records.
    await ContentService.deleteContentUserAuthorRel(c_id);

    await db.query(
      `INSERT INTO ${tableName} (c_id, user_id) VALUES ($1, $2) RETURNING *`,
      [c_id, user_id]
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

// Delete record by content id.
router.delete("/c_id/:c_id", [auth, service], async (req, res) => {
  const id = req.params.c_id;
  await db.query(`DELETE FROM ${tableName} WHERE c_id = $1`, [id]);

  res.send(deleteSuccessMessage);
});
