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
const tableName = 'cxahub.t_application_property';
const viewName = 'cxahub.v_application_property';
const orderBy = 'ORDER BY sort_id ASC';

//Set services used by route.
const ApplicationPropertyService = require('../../../services/application/ApplicationPropertyService');

//Enable wrap for async.
const wrap = require('express-async-wrap');

//Get all records.
router.get('/', [auth, service], cache(cachMins), async (req, res) => {

    try {

      let qry = `SELECT * FROM ${viewName} WHERE 0=0`;

      if(req.query.appp_name) {
  
        qry = qry + ` AND appp_name = '${req.query.appp_name}'`;
  
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

    const { appp_name, appp_description, appp_var_code, apppt_id, user_id, sort_id, status_id } = req.body

    //Check if record exists.
    const checkExist = await ApplicationPropertyService.findByName(appp_name, baseURL);

    //If record exists, do not post.
    if(checkExist != '') {

      res.send(`Member already exists: ${appp_name}`)

    } else {

      const { rows } = await db.query(`INSERT INTO ${tableName} (appp_name, appp_description, appp_var_code, apppt_id, user_id, sort_id, status_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, [appp_name, appp_description, appp_var_code, apppt_id, user_id, sort_id, status_id])
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
    const { appp_name, appp_description, appp_var_code, apppt_id, user_id, sort_id, status_id } = req.body
    const { rows } = await db.query(`UPDATE ${tableName} SET appp_name = $2, appp_description = $3, appp_var_code = $4, appp_time_updated = now(), apppt_id = $5, user_id = $6, sort_id = $7, status_id = $8 WHERE id = $1`, [id, appp_name, appp_description, appp_var_code, apppt_id, user_id, sort_id, status_id])
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