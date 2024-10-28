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
const tableName = "cxahub.t_content";
//TODO: Fix this reference fot industry version.
const viewName = "cxahub.v_content";
const orderBy = "ORDER BY sort_id ASC";

//Set messaging.
const createSuccessMessage = "You have created the content successfully.";
const updateSuccessMessage = "You have updated the content successfully.";
const deleteSuccessMessage = "You have deleted the content successfully.";

//Set services used by route.
const ContentService = require("../../../services/content/ContentService");
const Regex = require("../../../services/regex/Regex");

//Enable wrap for async.
const wrap = require("express-async-wrap");

//Get all records.
router.get("/", [auth, service], cache(cachMins), async (req, res) => {
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
          OR UPPER(author_last_name) LIKE '%${keyword.trim().toUpperCase()}%'
          OR UPPER(author_first_name) LIKE '%${keyword.trim().toUpperCase()}%'
          )`;
        });
      }
    }

    //Content id.
    if (req.query.id) {
      qry = qry + ` AND id = '${req.query.id}'`;
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
    res.send(rows);
  } catch ({ response }) {
    return res.sendStatus(response.status);
  }
});

// Create record.
router.post(
  "/",
  [auth, service],
  wrap(async function (req, res) {
    const {
      c_title,
      c_caption,
      c_story,
      c_read_time,
      c_tag,
      c_date_rel,
      c_date_exp,
      img_id,
      ct_id,
      author_user_id,
      user_id,
      sort_id,
      status_id,
    } = req.body;

    //Set c_canonical_title.
    const c_canonical_title = Regex.canonicalText(c_title);

    //Check if record exists.
    const checkExist = await ContentService.findByCanonicalTitle(
      c_canonical_title,
      0
    );

    //If record exists, do not post.
    if (checkExist != "") {
      res.send(`Content already exists: ${c_canonical_title}`);
    } else {
      const { rows } = await db.query(
        `INSERT INTO ${tableName} (c_title, c_canonical_title, c_caption, c_story, c_read_time, c_tag, c_date_rel, c_date_exp, img_id, ct_id, author_user_id, user_id, sort_id, status_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
        [
          c_title,
          c_canonical_title,
          c_caption,
          c_story,
          c_read_time,
          c_tag,
          c_date_rel,
          c_date_exp,
          img_id,
          ct_id,
          author_user_id,
          user_id,
          sort_id,
          status_id,
        ]
      );

      const id = rows[0].id;

      res.send(createSuccessMessage);
    }
  })
);

// Update record.
router.put("/:id", [auth, service], async (req, res) => {
  const { id } = req.params;
  const {
    c_title,
    c_caption,
    c_story,
    c_read_time,
    c_tag,
    c_date_rel,
    c_date_exp,
    img_id,
    ct_id,
    author_user_id,
    user_id,
    sort_id,
    status_id,
  } = req.body;

  //Set c_canonical_title.
  const c_canonical_title = regex.canonicalText(c_title);

  //Check if record exists.
  const checkExist = await ContentService.findByCanonicalTitle(
    c_canonical_title,
    id
  );

  if (checkExist != "") {
    res.send(`Content canonical title already exists: ${c_canonical_title}.`);
  } else {
    const { rows } = await db.query(
      `UPDATE ${tableName} SET c_title = $2, c_canonical_title = $3, c_caption = $4, c_story = $5, c_read_time = $6, c_tag = $7, c_time_updated = now(), c_date_rel = $8, c_date_exp = $9, img_id = $10, ct_id = $11, author_user_id = $12, user_id = $13, sort_id = $14, status_id = $15 WHERE id = $1`,
      [
        id,
        c_title,
        c_canonical_title,
        c_caption,
        c_story,
        c_read_time,
        c_tag,
        c_date_rel,
        c_date_exp,
        img_id,
        ct_id,
        author_user_id,
        user_id,
        sort_id,
        status_id,
      ]
    );

    res.send(updateSuccessMessage);
  }
});

// Delete record.
router.delete(
  "/:id",
  [auth, service],
  wrap(async function (req, res) {
    const { id } = req.params;
    const { rows } = await db.query(`DELETE FROM ${tableName} WHERE id = $1`, [
      id,
    ]);

    //Delete relationship records.
    await ContentService.deleteContentDocumentRel(id);
    await ContentService.deleteContentIndustryRel(id);
    await ContentService.deleteContentRelatedRel(id);
    await ContentService.deleteContentVideoRel(id);

    res.send(deleteSuccessMessage);
  })
);
