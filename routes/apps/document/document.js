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
const tableName = 'cxahub.t_document';
const viewName = 'cxahub.v_document';
const orderBy = 'ORDER BY sort_id ASC';

//Set services used by route.
const DocumentService = require('../../../services/document/DocumentService');

//Enable wrap for async.
const wrap = require('express-async-wrap');

//Get all records.
router.get('/', [auth, service], cache(cachMins), async (req, res) => {

    try {

      let qry = `SELECT * FROM ${viewName} WHERE 0=0`;

      if(req.query.doc_name) {
  
        qry = qry + ` AND doc_name = '${req.query.doc_name}'`;
  
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

    const { doc_name, doc_description, doc_file, doc_file_size, doc_mime, doc_tag, doc_date_rel, doc_date_exp, doct_id, user_id, sort_id, status_id } = req.body

    //Check if record exists.
    const checkExist = await DocumentService.findByName(doc_name, baseURL);

    //If record exists, do not post.
    if(checkExist != '') {

      res.send(`Member already exists: ${doc_name}`)

    } else {

      const { rows } = await db.query(`INSERT INTO ${tableName} (doc_name, doc_description, doc_file, doc_file_size, doc_mime, doc_tag, doc_date_rel, doc_date_exp, doct_id, user_id, sort_id, status_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`, [doc_name, doc_description, doc_file, doc_file_size, doc_mime, doc_tag, doc_date_rel, doc_date_exp, doct_id, user_id, sort_id, status_id ])
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
    const { doc_name, doc_description, doc_file, doc_file_size, doc_mime, doc_tag, doc_date_rel, doc_date_exp, doct_id, user_id, sort_id, status_id } = req.body
    const { rows } = await db.query(`UPDATE ${tableName} SET doc_name = $2, doc_description = $3, doc_file = $4, doc_file_size = $5, doc_mime = $6, doc_tag = $7, doc_time_updated = now(), doc_date_rel = $8,  doc_date_exp = $9, doct_id = $10, user_id = $11, sort_id = $12, status_id = $13 WHERE id = $1`, [id, doc_name, doc_description, doc_file, doc_file_size, doc_mime, doc_tag, doc_date_rel, doc_date_exp, doct_id, user_id, sort_id, status_id])
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