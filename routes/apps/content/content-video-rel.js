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
const tableName = "cxahub.t_content_video_rel";
const viewName = "cxahub.v_content_video_rel";
const orderBy = "";

//Set messaging.
const createSuccessMessage =
  "You have created the content video rel. successfully.";
const deleteSuccessMessage =
  "You have deleted the content video rel. successfully.";

//Set services used by route.
//const ContentvideoRelService = require('../../../services/content/ContentvideoRelService');
const ContentService = require("../../../services/content/ContentService");

//Enable wrap for async.
const wrap = require("express-async-wrap");
//Get all records.
router.get("/", [auth, service], cache(cachMins), async (req, res) => {
  try {
    let qry = `SELECT * FROM ${viewName} WHERE 0=0`;

    if (req.query.c_id && req.query.v_id) {
      qry =
        qry +
        ` AND (c_id = '${req.query.c_id}' AND v_id = '${req.query.v_id}')`;
    }

    if (req.query.c_id) {
      qry = qry + ` AND (c_id = '${req.query.c_id}')`;
    }

    if (req.query.v_id) {
      qry = qry + ` AND (v_id = '${req.query.v_id}')`;
    }

    //Filter by date rel.
    if (req.query.v_date_rel) {
      qry = qry + ` AND (v_date_rel < '${req.query.v_date_rel}')`;
    }

    //Filter by date gte.
    if (req.query.v_date_exp) {
      qry = qry + ` AND (v_date_exp >= '${req.query.v_date_exp}')`;
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
    const { c_id, v_id } = req.body;

    //First delete any existing relationship records.
    await ContentService.deleteContentVideoRel(c_id);

    await db.query(
      `INSERT INTO ${tableName} (c_id, v_id) VALUES ($1, $2) RETURNING *`,
      [c_id, v_id]
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