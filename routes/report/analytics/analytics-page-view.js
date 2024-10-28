//Set router object.
const Router = require("express-promise-router");
const router = new Router();
const apicache = require("apicache");
let cache = apicache.middleware;
const cachMins = "0 minutes";

// Export our router to be mounted by the parent application
module.exports = router;

//Set DB connection and auth.
const db = require("../../../db");
const auth = require("../../../middleware/auth");
const { service } = require("../../../middleware/roles");

//Set table and view names plus any default query variables.
const tableName = "cxahub.t_analytics_page_view";
const viewName = "cxahub.v_analytics_page_view";
const orderBy = "ORDER BY apv_time_created ASC";

//Set messaging.
const createSuccessMessage =
  "You have created the analytics page view successfully.";
const deleteSuccessMessage =
  "You have deleted the analytics page view successfully.";

//Enable wrap for async.
const wrap = require("express-async-wrap");

//Get all records.
router.get("/", [auth, service], cache(cachMins), async (req, res) => {
  try {
    let qry = `SELECT * FROM ${viewName} WHERE 0=0`;

    if (req.query.ref_id) {
      qry = qry + ` AND ref_id = '${req.query.ref_id}'`;
    }

    if (req.query.apvt_id) {
      qry = qry + ` AND apvt_id = '${req.query.apvt_id}'`;
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
    try {
      const { ref_id, apvt_id, user_id, status_id } = req.body;

      await db.query(
        `INSERT INTO ${tableName} (ref_id, apvt_id, user_id, status_id) VALUES ($1, $2, $3, $4) RETURNING *`,
        [ref_id, apvt_id, user_id, status_id]
      );

      res.send(createSuccessMessage);
    } catch ({ res, error }) {
      console.log(
        "An error occured in analytics-page-view POST api:" +
          error.response +
          res
      );
    }
  })
);

// Delete record.
router.delete("/:id", [auth, service], async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(`DELETE FROM ${tableName} WHERE id = $1`, [
      id,
    ]);
    res.send(`Record deleted with ID: ${id}`);
  } catch (error) {
    res.send("An error occurred deleting the record." + error);
  }
});
