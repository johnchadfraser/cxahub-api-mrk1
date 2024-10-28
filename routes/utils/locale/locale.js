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

const tableName = "cxahub.t_locale";
const viewName = "cxahub.v_locale";
const orderBy = "ORDER BY ll_id, lt_id";

//Get all records.
router.get("/", [auth, service], cache(cachMins), async (req, res) => {
  //try {
  let qry = `SELECT * FROM ${viewName} WHERE 0=0`;

  if (req.query.ref_id) {
    qry = qry + ` AND ref_id = '${req.query.ref_id}'`;
  }

  if (req.query.l_column_name) {
    qry = qry + ` AND l_column_name = '${req.query.l_column_name}'`;
  }

  if (req.query.ll_id) {
    qry = qry + ` AND ll_id = '${req.query.LL_id}'`;
  }

  if (req.query.ll_code) {
    qry = qry + ` AND ll_code = '${req.query.ll_code}'`;
  }

  if (req.query.lt_id) {
    qry = qry + ` AND lt_id = '${req.query.lt_id}'`;
  }

  if (req.query.status_id) {
    qry = qry + ` AND status_id = '${req.query.status_id}'`;
  }

  if (orderBy != "") {
    qry = qry + ` ${orderBy}`;
  }

  const { rows } = await db.query(qry);
  res.send(rows);
  /*} catch ({ response }) {
    return res.sendStatus(response.status);
  }*/
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
