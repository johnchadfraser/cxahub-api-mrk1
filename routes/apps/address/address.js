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
const tableName = "cxahub.t_address";
const viewName = "cxahub.v_address";
const orderBy = "ORDER BY sort_id ASC";

//Set messaging.
const createSuccessMessage = "You have created the address successfully.";
const updateSuccessMessage = "You have updated the address successfully.";
const deleteSuccessMessage = "You have deleted the address successfully.";

//Set services used by route.
const AddressService = require("../../../services/address/AddressService");

//Enable wrap for async.
const wrap = require("express-async-wrap");

//Get all records.
router.get("/", [auth, service], cache(cachMins), async (req, res) => {
  try {
    let qry = `SELECT * FROM ${viewName} WHERE 0=0`;

    if (req.query.id) {
      qry = qry + ` AND id = '${req.query.id}'`;
    }

    if (req.query.a_name) {
      qry = qry + ` AND a_name = '${req.query.a_name}'`;
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
  } catch ({ response, error }) {
    console.error("An error occured in address GET api:" + error.response.data);

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
  } catch ({ response, error }) {
    console.error(
      "An error occured in address GET id api:" + error.response.data
    );

    return res.sendStatus(response.status);
  }
});

// Create record.
router.post("/", [auth, service], async (req, res) => {
  try {
    const {
      a_name,
      a_no,
      a_address,
      a_address_ext,
      a_city,
      sp_id,
      cntry_id,
      a_zipcode,
      a_zipcode_ext,
      at_id,
      user_id,
      sort_id,
      status_id,
    } = req.body;

    //Check if record exists.
    const checkExist = await AddressService.findByNameUserID(a_name, user_id);

    //If record exists, do not post.
    if (checkExist != "") {
      res.send(checkExist[0].a_id);
    } else {
      const { rows } = await db.query(
        `INSERT INTO ${tableName} (a_name, a_no, a_address, a_address_ext, a_city, sp_id, cntry_id, a_zipcode, a_zipcode_ext, at_id, user_id, sort_id, status_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
        [
          a_name,
          a_no,
          a_address,
          a_address_ext,
          a_city,
          sp_id,
          cntry_id,
          a_zipcode,
          a_zipcode_ext,
          at_id,
          user_id,
          sort_id,
          status_id,
        ]
      );

      //Return the id required for some other api calls.
      res.send(`${rows[0].id}`);
    }
  } catch ({ response, error }) {
    console.error(
      "An error occured in address POST api:" + error.response.data
    );

    return res.sendStatus(response.status);
  }
});

// Update record.
router.put("/:id", [auth, service], async (req, res) => {
  try {
    const { id } = req.params;
    const {
      a_name,
      a_no,
      a_address,
      a_address_ext,
      a_city,
      sp_id,
      cntry_id,
      a_zipcode,
      a_zipcode_ext,
      at_id,
      user_id,
      sort_id,
      status_id,
    } = req.body;
    const { rows } = await db.query(
      `UPDATE ${tableName} SET a_name = $2, a_no = $3, a_address = $4 , a_address_ext = $5, a_city= $6, sp_id= $7, cntry_id = $8,  a_zipcode = $9, a_zipcode_ext = $10, a_time_updated = now(), at_id = $11, user_id = $12, sort_id = $13, status_id = $14 WHERE id = $1`,
      [
        id,
        a_name,
        a_no,
        a_address,
        a_address_ext,
        a_city,
        sp_id,
        cntry_id,
        a_zipcode,
        a_zipcode_ext,
        at_id,
        user_id,
        sort_id,
        status_id,
      ]
    );
    res.send(`Record modified with ID: ${id}`);
  } catch ({ response, error }) {
    console.error("An error occured in address PUT api:" + error.response.data);

    return res.sendStatus(response.status);
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
  } catch ({ response, error }) {
    console.error(
      "An error occured in address DELETE api:" + error.response.data
    );

    return res.sendStatus(response.status);
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
      "An error occured in address DELETE id api:" + error.response.data
    );

    return res.sendStatus(response.status);
  }
});
