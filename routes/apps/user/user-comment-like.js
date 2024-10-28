const axios = require("axios");

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
const tableName = "cxahub.t_user_comment_like_user_rel";
const viewName = "cxahub.v_user_comment_like_user_rel";
const orderBy = "ORDER BY uc_id ASC";

//Set messaging.
const createSuccessMessage =
  "You have created the user comment like successfully.";
const deleteSuccessMessage =
  "You have deleted the user comment like successfully.";

//Set services used by route.
//const UserCommentService = require("../../../services/user/UserCommentService");

//Enable wrap for async.
const wrap = require("express-async-wrap");

//Get all records.
router.get("/", [auth, service], cache(cachMins), async (req, res) => {
  try {
    let qry = `SELECT * FROM ${viewName} WHERE 0=0`;

    if (req.query.ref_id) {
      qry = qry + ` AND ref_id = '${req.query.ref_id}'`;
    }

    if (req.query.uc_id) {
      qry = qry + ` AND uc_id = '${req.query.uc_id}'`;
    }

    if (req.query.uc_parent_id) {
      qry = qry + ` AND uc_parent_id = '${req.query.uc_parent_id}'`;
    }

    if (req.query.uct_id) {
      qry = qry + ` AND uct_id = '${req.query.uct_id}'`;
    }

    if (req.query.ms_id) {
      qry = qry + ` AND ms_id = '${req.query.ms_id}'`;
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
  wrap(async (req, res) => {
    try {
      const { uc_id, user_id, uclur_value } = req.body;

      await db.query(
        `INSERT INTO ${tableName} ( uc_id, user_id, uclur_value ) VALUES ($1, $2, $3) RETURNING *`,
        [uc_id, user_id, uclur_value]
      );

      //Update count on comment record.
      if (uclur_value) {
        await axios.put(`${apiURL}/user-comment/like-count/${uc_id}`);
      } else if (!uclur_value) {
        await axios.put(`${apiURL}/user-comment/dislike-count/${uc_id}`);
      }

      res.send(createSuccessMessage);
    } catch (error) {
      res.send("An error occurred creating the record." + error);
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

// Delete record by user id.
router.delete("/user_id/:user_id", [auth, service], async (req, res) => {
  try {
    const id = req.params.user_id;
    await db.query(`DELETE FROM ${tableName} WHERE user_id = $1`, [id]);

    res.send(deleteSuccessMessage);
  } catch ({ response, error }) {
    console.error(
      "An error occured in user-comment-like DELETE id api:" +
        error.response.data
    );

    return res.sendStatus(response.status);
  }
});
