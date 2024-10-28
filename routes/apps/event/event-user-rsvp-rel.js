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
const tableName = "cxahub.t_event_user_rsvp_rel";
const viewName = "cxahub.v_event_user_rsvp_rel";
const orderBy = "";

//Set services used by route.
const EventService = require("../../../services/event/EventService");

//Enable wrap for async.
const wrap = require("express-async-wrap");
//Get all records.
router.get("/", [auth, service], cache(cachMins), async (req, res) => {
  try {
    let qry = `SELECT * FROM ${viewName} WHERE 0=0`;

    if (req.query.e_id && req.query.user_id) {
      qry =
        qry +
        ` AND (e_id = '${req.query.e_id}' AND user_id = '${req.query.user_id}')`;
    }

    if (req.query.e_id) {
      qry = qry + ` AND e_id = '${req.query.e_id}'`;
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
    const { e_id, user_id } = req.body;

    //First delete any existing relationship records.
    await EventService.deleteEventUserRSVPRel(e_id, user_id);

    await db.query(
      `INSERT INTO ${tableName} (e_id, user_id) VALUES ($1, $2) RETURNING *`,
      [e_id, user_id]
    );
    if (!res.error && res.statusCode == 200) {
      res.status(res.statusCode).send({
        status: res.statusCode,
        success: "OK",
      });
    } else if (res.error) {
      res.status(400).send({
        status: res.statusCode,
        message: res.error,
        success: "NO",
      });
    } else {
      res.status(res.statusCode).send({
        status: res.statusCode,
        message: res.body,
        success: "NO",
      });
    }
  })
);

// Delete record.
router.delete("/:id", [auth, service], async (req, res) => {
  const id = req.params.id;
  await db.query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);
  if (!res.error && res.statusCode == 200) {
    res.status(res.statusCode).send({
      status: res.statusCode,
      success: "OK",
    });
  } else if (res.error) {
    res.status(400).send({
      status: res.statusCode,
      message: res.error,
      success: "NO",
    });
  } else {
    res.status(res.statusCode).send({
      status: res.statusCode,
      message: res.body,
      success: "NO",
    });
  }
});

// Delete record by event id.
router.delete(
  "/e_id/:e_id/user_id/:user_id",
  [auth, service],
  async (req, res) => {
    const e_id = req.params.e_id;
    const user_id = req.params.user_id;
    await db.query(
      `DELETE FROM ${tableName} WHERE e_id = $1 AND user_id = $2`,
      [e_id, user_id]
    );

    if (!res.error && res.statusCode == 200) {
      res.status(res.statusCode).send({
        status: res.statusCode,
        success: "OK",
      });
    } else if (res.error) {
      res.status(400).send({
        status: res.statusCode,
        message: res.error,
        success: "NO",
      });
    } else {
      res.status(res.statusCode).send({
        status: res.statusCode,
        message: res.body,
        success: "NO",
      });
    }
  }
);
