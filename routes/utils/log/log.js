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
const tableName = "cxahub.t_log";
const viewName = "cxahub.v_log";
const orderBy = "";

//Set services used by route.
//const LogService = require("../../../services/utils/LogService");

//Enable wrap for async.
const wrap = require("express-async-wrap");

//Get all records.
router.get("/", [auth, service], cache(cachMins), async (req, res) => {
  try {
    let qry = `SELECT * FROM ${viewName} WHERE 0=0`;

    if (req.query.log_name) {
      qry = qry + ` AND log_name = '${req.query.log_name}'`;
    }

    if (req.query.status_id) {
      qry = qry + ` AND status_id = '${req.query.status_id}'`;
    }

    if (orderBy != "") {
      qry = qry + ` ${orderBy}`;
    }

    const { rows } = await db.query(qry);
    res.send(rows);
  } catch ({ error }) {
    const emailObj = {
      subject: "CXAHUB API: Log Error (Interface)",
      html: `<p>An error occured in Log API GET: <br/><br/> <strong>${error.name}</strong><br/>${error.message}</p>`,
    };

    emailService.smtpHandler(emailObj);

    res.send("An error occured in Log API GET: " + error);
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
router.post("/", [auth, service], async (req, res) => {
  try {
    const { log_name, log_description, log_ip, logt_id, user_id } = req.body;

    const { rows } = await db.query(
      `INSERT INTO ${tableName} ( log_name, log_description, log_ip, logt_id, user_id  ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [log_name, log_description, log_ip, logt_id, user_id]
    );
    res.send(`Record added with ID: ${rows[0].id}`);
  } catch (error) {
    res.send("An error occurred creating the record." + error);
  }
});

// Update record.
router.put("/:id", [auth, service], async (req, res) => {
  try {
    const { id } = req.params;
    const { log_name, log_description, log_ip, logt_id, user_id, status_id } =
      req.body;
    const { rows } = await db.query(
      `UPDATE ${tableName} SET log_name = $2, log_description = $3, log_time_updated = now(), log_ip = $4 , logt_id = $5, user_id = $6, status_id = $7 WHERE id = $1`,
      [id, log_name, log_description, log_ip, logt_id, user_id, status_id]
    );
    res.send(`Record modified with ID: ${id}`);
  } catch (error) {
    res.send("An error occurred updating the record." + error);
  }
});

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
