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
const tableName = 'cxahub.t_image_type';
const viewName = 'cxahub.v_image_type';
const orderBy = '';

//Set services used by route.
const ImageTypeService = require('../../../services/image/ImageTypeService');

//Enable wrap for async.
const wrap = require('express-async-wrap');

//Get all records.
router.get('/', [auth, service], cache(cachMins), async (req, res) => {

    try {

      let qry = `SELECT * FROM ${viewName} WHERE 0=0`;

      if(req.query.imgt_name) {
  
        qry = qry + ` AND imgt_name = '${req.query.imgt_name}'`;
  
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

    const { imgt_name, imgt_path, imgt_width, imgt_width_thumb, imgt_width_small, imgt_width_medium, imgt_width_large, imgt_width_alt, user_id, status_id } = req.body

    //Check if record exists.
    const checkExist = await ImageTypeService.findByName(imgt_name);

    //If record exists, do not post.
    if(checkExist != '') {

      res.send(`Member already exists: ${imgt_name}`)

    } else {

      const { rows } = await db.query(`INSERT INTO ${tableName} (imgt_name, imgt_path, imgt_width, imgt_width_thumb, imgt_width_small, imgt_width_medium, imgt_width_large, imgt_width_alt, user_id, status_id ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, [imgt_name, imgt_path, imgt_width, imgt_width_thumb, imgt_width_small, imgt_width_medium, imgt_width_large, imgt_width_alt, user_id, status_id  ])
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
    const { imgt_name, imgt_path, imgt_width, imgt_width_thumb, imgt_width_small, imgt_width_medium, imgt_width_large, imgt_width_alt, user_id, status_id} = req.body
    const { rows } = await db.query(`UPDATE ${tableName} SET imgt_name = $2, imgt_path = $3, imgt_width = $4 , imgt_width_thumb = $5, imgt_width_small= $6, imgt_width_medium= $7, imgt_width_large = $8,  imgt_width_alt = $9, imgt_time_updated = now(), user_id = $10,  status_id = $11 WHERE id = $1`, [id, imgt_name, imgt_path, imgt_width, imgt_width_thumb, imgt_width_small, imgt_width_medium, imgt_width_large, imgt_width_alt, user_id, status_id])
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