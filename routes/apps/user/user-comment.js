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
const tableName = "cxahub.t_user_comment";
const viewName = "cxahub.v_user_comment";
const orderBy = "ORDER BY uc_time_created DESC";

//Set messaging.
const createSuccessMessage = "You have created the user comment successfully.";
const deleteSuccessMessage = "You have deleted the user comment successfully.";

//Set services used by route.
//const UserCommentService = require("../../../services/user/UserCommentService");

//Enable wrap for async.
const wrap = require("express-async-wrap");

//Get all records.
//Get all records. NO CACHE HERE!!!
router.get("/", [auth, service], async (req, res) => {
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
router.post("/", [auth, service], async (req, res) => {
  try {
    const {
      ref_id,
      uc_parent_id,
      uc_id,
      uc_comment,
      uct_id,
      ms_id,
      user_id,
      sort_id,
      status_id,
    } = req.body;

    const { rows } = await db.query(
      `INSERT INTO ${tableName} ( ref_id, uc_parent_id, uc_id, uc_comment, uct_id, ms_id, user_id, sort_id, status_id ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        ref_id,
        uc_parent_id,
        uc_id,
        uc_comment,
        uct_id,
        ms_id,
        user_id,
        sort_id,
        status_id,
      ]
    );
    const newRecord = await db.query(
      `SELECT * FROM ${viewName} WHERE id = ${rows[0].id}`
    );
    res.send(newRecord.rows[0]);
  } catch (error) {
    res.send("An error occurred creating the record." + error);
  }
});

// Update record.
router.put("/:id", [auth, service], async (req, res) => {
  try {
    const { id } = req.params;
    const { uc_comment, status_id } = req.body;
    const { rows } = await db.query(
      `UPDATE ${tableName} SET uc_comment = $2, status_id = $3 WHERE id = $1`,
      [id, uc_comment, status_id]
    );
    res.send(`Record modified with ID: ${id}`);
  } catch (error) {
    res.send("An error occurred updating the record." + error);
  }
});

// Update share count record.
router.put("/share-count/:id", [auth, service], async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(
      `UPDATE ${tableName} SET uc_share_count = uc_share_count+1 WHERE id = $1`,
      [id]
    );
    res.send(`Record modified with ID: ${id}`);
  } catch (error) {
    res.send("An error occurred updating the record." + error);
  }
});

// Update like count record.
router.put("/like-count/:id", [auth, service], async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(
      `UPDATE ${tableName} SET uc_like_count = uc_like_count+1 WHERE id = $1`,
      [id]
    );
    res.send(`Record modified with ID: ${id}`);
  } catch (error) {
    res.send("An error occurred updating the record." + error);
  }
});

// Update dislike count record.
router.put("/dislike-count/:id", [auth, service], async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(
      `UPDATE ${tableName} SET uc_dislike_count = uc_dislike_count+1 WHERE id = $1`,
      [id]
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

// Delete record by user id.
router.delete("/user_id/:user_id", [auth, service], async (req, res) => {
  try {
    const id = req.params.user_id;
    await db.query(`DELETE FROM ${tableName} WHERE user_id = $1`, [id]);

    res.send(deleteSuccessMessage);
  } catch ({ response, error }) {
    console.error(
      "An error occured in user-comment DELETE id api:" + error.response.data
    );

    return res.sendStatus(response.status);
  }
});
