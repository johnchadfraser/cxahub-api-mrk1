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
const tableName = 'cxahub.t_image';
const viewName = 'cxahub.v_image';
const orderBy = '';

//Set services used by route.
const ImageService = require('../../../services/image/ImageService');

//Enable wrap for async.
const wrap = require('express-async-wrap');

//Get all records.
router.get('/', [auth, service], cache(cachMins), async (req, res) => {

    try {

      let qry = `SELECT * FROM ${viewName} WHERE 0=0`;

      if(req.query.img_name) {
  
        qry = qry + ` AND img_name = '${req.query.img_name}'`;
  
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

    const { img_name, img_file, imgt_id, user_id, status_id } = req.body

    //Check if record exists.
    const checkExist = await ImageService.findByName(img_name, baseURL);

    //If record exists, do not post.
    if(checkExist != '') {

      res.send(`Member already exists: ${img_name}`)

    } else {

      const { rows } = await db.query(`INSERT INTO ${tableName} (img_name, img_file, imgt_id, user_id, status_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [img_name, img_file, imgt_id, user_id, status_id])
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
    const { img_name, img_file, imgt_id, user_id, status_id } = req.body
    const { rows } = await db.query(`UPDATE ${tableName} SET img_name = $2, img_file = $3, img_time_updated = now(), imgt_id = $4, user_id = $5, status_id = $6 WHERE id = $1`, [id, img_name, img_file, imgt_id, user_id, status_id])
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