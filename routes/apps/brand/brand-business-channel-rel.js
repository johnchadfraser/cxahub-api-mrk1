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
const tableName = 'cxahub.t_brand_business_channel_rel';
const viewName = 'cxahub.v_brand_business_channel_rel';
const orderBy = '';

//Set messaging.
const createSuccessMessage = 'You have created the brand business channel rel. successfully.';
const deleteSuccessMessage = 'You have deleted the brand business channel rel. successfully.';

//Set services used by route.

const BrandBusinessChannelRelService = require('../../../services/brand/BrandBusinessChannelRelService');

//Enable wrap for async.
const wrap = require('express-async-wrap');
//Get all records.
router.get('/', [auth, service], cache(cachMins), async (req, res) => {

  try {

    let qry = `SELECT * FROM ${viewName} WHERE 0=0`;

    if(req.query.b_id && req.query.bc_id) {

      qry = qry + ` AND (b_id = '${req.query.b_id}' AND bc_id = '${req.query.bc_id}')`;

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
router.post('/', [auth, service], wrap(async function(req, res) {
    
  const { b_id, bc_id } = req.body

  //First delete any existing relationship records.
  await BrandBusinessChannelRelService.deleteBrandBusinessChannelRel(b_id);

  await db.query(`INSERT INTO ${tableName} (b_id, bc_id) VALUES ($1, $2) RETURNING *`, [b_id, bc_id])

  res.send(createSuccessMessage); 

}))

// Delete record.
router.delete('/:id', [auth, service], async (req, res) => {

  const id = req.params.id
  await db.query(`DELETE FROM ${tableName} WHERE id = $1`, [id])

  res.send(deleteSuccessMessage)

})

// Delete record by brand id.
router.delete('/b_id/:b_id', [auth, service], async (req, res) => {

  const id = req.params.b_id
  await db.query(`DELETE FROM ${tableName} WHERE b_id = $1`, [id])

  res.send(deleteSuccessMessage)

})

//NOT sure about this
// Delete record by user id.
router.delete('/user_id/:user_id', [auth, service], async (req, res) => {

  const id = req.params.user_id
  await db.query(`DELETE FROM ${tableName} WHERE user_id = $1`, [id])

  res.send(deleteSuccessMessage)

})