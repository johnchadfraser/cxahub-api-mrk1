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
const tableName = "cxahub.t_content_industry_rel";
const viewName = "cxahub.v_content_industry_rel";
const orderBy = "";

//Set messaging.
const createSuccessMessage =
  "You have created the content industry rel. successfully.";
const deleteSuccessMessage =
  "You have deleted the content industry rel. successfully.";

//Set services used by route.
//const ContentIndustryRelService = require('../../../services/content/ContentIndustryRelService');
const ContentService = require("../../../services/content/ContentService");

//Enable wrap for async.
const wrap = require("express-async-wrap");
//Get all records.
router.get("/", [auth, service], async (req, res) => {
  try {
    let qry = `SELECT * FROM ${viewName} WHERE 0=0`;

    //Filter by keywords.
    if (req.query.kw) {
      //Convert keywords into an array with a space delimeter.
      const kw_arr = req.query.kw.split(" ").map((element) => {
        return String(element);
      });

      //Check if is a valid array.
      if (Array.isArray(kw_arr)) {
        //Loop over keywords.
        kw_arr.forEach(function (keyword, index) {
          //Set operator for kw looped query.
          sqlOperator = "AND";
          if (index != 0) {
            sqlOperator = "OR";
          }

          qry =
            qry +
            ` ${sqlOperator} (UPPER(c_title) LIKE '%${keyword
              .trim()
              .toUpperCase()}%' 
          OR UPPER(c_caption) LIKE '%${keyword.trim().toUpperCase()}%'
          OR UPPER(c_story) LIKE '%${keyword.trim().toUpperCase()}%'
          OR UPPER(c_tag) LIKE '%${keyword.trim().toUpperCase()}%'
          OR UPPER(i_name) LIKE '%${keyword.trim().toUpperCase()}%'
          OR UPPER(author_last_name) LIKE '%${keyword.trim().toUpperCase()}%'
          OR UPPER(author_first_name) LIKE '%${keyword.trim().toUpperCase()}%'
          )`;
        });
      }
    }

    //Id.
    if (req.query.id) {
      qry = qry + ` AND id = '${req.query.id}'`;
    }

    //Content id.
    if (req.query.c_id) {
      qry = qry + ` AND c_id = '${req.query.c_id}'`;
    }

    //Exclude content id.
    if (req.query.exclude_c_id) {
      qry = qry + ` AND id <> '${req.query.exclude_c_id}'`;
    }

    //Filter by title.
    if (req.query.c_title) {
      qry =
        qry +
        ` AND UPPER(c_title) = '${req.query.c_title.trim().toUpperCase()}'`;
    }

    //Filter by canonical title.
    if (req.query.c_canonical_title) {
      qry =
        qry +
        ` AND UPPER(c_canonical_title) = '${req.query.c_canonical_title
          .trim()
          .toUpperCase()}'`;
    }

    //Filter by date posted lt.
    if (req.query.c_date_posted_lt) {
      qry = qry + ` AND (c_date_posted < '${req.query.c_date_posted_lt}')`;
    }

    //Filter by date posted gte.
    if (req.query.c_date_posted_gte) {
      qry = qry + ` AND (c_date_posted >= '${req.query.c_date_posted_gte}')`;
    }

    //Filter by date of release.
    if (req.query.c_date_rel) {
      qry =
        qry +
        ` AND (c_date_rel <= '${req.query.c_date_rel}' OR c_date_rel = '1900-01-01')`;
    }

    //Filter by date of expiration.
    if (req.query.c_date_exp) {
      qry =
        qry +
        ` AND (c_date_exp > '${req.query.c_date_exp}' OR c_date_exp = '1900-01-01')`;
    }

    //Filter by content type.
    if (req.query.ct_id) {
      qry = qry + ` AND ct_id = '${req.query.ct_id}'`;
    }

    //Filter by content industry.
    if (req.query.i_id && req.query.i_id != 0) {
      qry = qry + ` AND i_id = ${req.query.i_id}`;
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
    const { c_id, i_id } = req.body;

    //First delete any existing relationship records.
    await ContentService.deleteContentIndustryRel(c_id);

    await db.query(
      `INSERT INTO ${tableName} (c_id, i_id) VALUES ($1, $2) RETURNING *`,
      [c_id, i_id]
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
