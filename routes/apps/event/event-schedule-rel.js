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
const tableName = "cxahub.t_event_schedule_rel";
const viewName = "cxahub.v_event_schedule_rel";
const orderBy = "";

//Set messaging.
const createSuccessMessage =
  "You have created the event schedule rel. successfully.";
const deleteSuccessMessage =
  "You have deleted the event schedule rel. successfully.";

//Set services used by route.

const EventService = require("../../../services/event/EventService");

//Enable wrap for async.
const wrap = require("express-async-wrap");
//Get all records.
router.get("/", [auth, service], cache(cachMins), async (req, res) => {
  try {
    let qry = `SELECT * FROM ${viewName} WHERE 0=0`;

    if (
      req.query.e_id &&
      req.query.e_detail &&
      req.query.e_time_id_start &&
      req.query.e_time_id_end
    ) {
      qry =
        qry +
        ` AND (e_id = '${req.query.e_id}' AND e_detail = '${req.query.e_detail}' AND e_time_id_start = '${req.query.e_time_id_start}') AND e_time_id_end = '${req.query.e_time_id_end}')`;
    }

    if (req.query.e_id) {
      qry = qry + ` AND e_id = '${req.query.e_id}'`;
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
    const { e_id, e_detail, e_time_id_start, e_time_id_end } = req.body;

    //First delete any existing relationship records.
    await EventService.deleteEventScheduleRel(e_id);

    await db.query(
      `INSERT INTO ${tableName} (e_id, e_detail, e_time_id_start, e_time_id_end) VALUES ($1, $2, $3, $4) RETURNING *`,
      [e_id, e_detail, e_time_id_start, e_time_id_end]
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

// Delete record by event id.
router.delete("/e_id/:e_id", [auth, service], async (req, res) => {
  const id = req.params.e_id;
  await db.query(`DELETE FROM ${tableName} WHERE e_id = $1`, [id]);

  res.send(deleteSuccessMessage);
});
