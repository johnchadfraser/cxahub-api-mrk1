//Set router object.
const Router = require('express-promise-router');
const router = new Router();
const apicache = require('apicache');
let cache = apicache.middleware
const cachMins = '20 minutes';

// Export our router to be mounted by the parent application
module.exports = router;

//Set DB connection and auth.
const db = require('../../../db');
const auth = require("../../../middleware/auth");
const { service } = require("../../../middleware/roles");

//Set table and view names plus any default query variables.
const tableName = 'cxahub.t_alert';
const viewName = 'cxahub.v_alert';
const orderBy = 'ORDER BY sort_id ASC';

//Set services used by route.
const AlertService = require('../../../services/alert/AlertService');

//Enable wrap for async.
const wrap = require('express-async-wrap');

//Get all records.
router.get('/', [auth, service], cache(cachMins), async (req, res) => {

    try {

      let qry = `SELECT * FROM ${viewName} WHERE 0=0`;

      if(req.query.a_name) {
  
        qry = qry + ` AND a_name = '${req.query.a_name}'`;
  
      }
  
      if(req.query.status_id) {
  
        qry = qry + ` AND status_id = '${req.query.status_id}'`;
  
      }
  
      if(orderBy != '') {
  
        qry = qry + ` ${orderBy}`;
  
      }
  
      const { rows } = await db.query(qry)
      res.send(rows)
  
    } catch ({ response }) {
  
      return res.sendStatus(response.status);
  
    }
  
  })
  
  // Get by id.
  router.get('/:id', [auth, service], async (req, res) => {
  
    try {
      
      const { id } = req.params 
      const { rows } = await db.query(`SELECT * FROM ${viewName} WHERE id = $1`, [id])
      res.send(rows[0])
  
    } catch ({ response }) {
  
      return res.sendStatus(response.status);
  
    }
  
  })

// Create record.
router.post('/', [auth, service], async (req, res) => {

  try {

    const { a_name, a_description, a_date_rel, a_date_exp, at_id, ap_id, user_id, sort_id, status_id } = req.body

    //Check if record exists.
    const checkExist = await AlertService.findByName(a_name);

    //If record exists, do not post.
    if(checkExist != '') {

      res.send(`Member already exists: ${a_name}`)

    } else {

      const { rows } = await db.query(`INSERT INTO ${tableName} (a_name, a_description, a_date_rel, a_date_exp, at_id, ap_id, user_id, sort_id, status_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, [a_name, a_description, a_date_rel, a_date_exp, at_id, ap_id, user_id, sort_id, status_id ])
      res.send(`Record added with ID: ${rows[0].id}`)

    }

  } catch (error) {

    res.send('An error occurred creating the record.' + error);

  }
  
})

// Update record.
router.put('/:id', [auth, service], async (req, res) => {

  try {

    const { id } = req.params
    const { a_name, a_description, a_date_rel, a_date_exp, at_id, ap_id, user_id, sort_id, status_id } = req.body
    const { rows } = await db.query(`UPDATE ${tableName} SET a_name = $2, a_description = $3, a_time_updated = now(), a_date_rel = $4,  a_date_exp = $5, at_id = $6, ap_id = $7, user_id = $8, sort_id = $9, status_id = $10 WHERE id = $1`, [id, a_name, a_description, a_date_rel, a_date_exp, at_id, ap_id, user_id, sort_id, status_id])
    res.send(`Record modified with ID: ${id}`)

  } catch (error) {

    res.send('An error occurred updating the record.' + error);

  }

})

// Delete record.
router.delete('/:id', [auth, service], async (req, res) => {

  try {

    const { id } = req.params
    const { rows } = await db.query(`DELETE FROM ${tableName} WHERE id = $1`, [id])
    res.send(`Record deleted with ID: ${id}`)

  } catch (error) {

    res.send('An error occurred deleting the record.' + error);

  }

})