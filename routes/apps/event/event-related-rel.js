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
const tableName = 'cxahub.t_event_related_rel';
const viewName = 'cxahub.v_event_related_rel';
const orderBy = '';

//Set messaging.
const createSuccessMessage = 'You have created the event related rel. successfully.';
const deleteSuccessMessage = 'You have deleted the event related rel. successfully.';

//Set services used by route.
//const EventrelatedRelService = require('../../../services/event/EventrelatedRelService');
const EventService = require('../../../services/event/EventService');

//Enable wrap for async.
const wrap = require('express-async-wrap');
//Get all records.
router.get('/', [auth, service], cache(cachMins), async (req, res) => {

  try {

    let qry = `SELECT * FROM ${viewName} WHERE 0=0`;

    if(req.query.e_id && req.query.related_e_id) {

      qry = qry + ` AND (e_id = '${req.query.e_id}' AND related_e_id = '${req.query.related_e_id}')`;

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
    
  const { e_id, related_e_id } = req.body

  //First delete any existing relationship records.
  await EventService.deleteEventRelatedRel(e_id);

  await db.query(`INSERT INTO ${tableName} (e_id, related_e_id) VALUES ($1, $2) RETURNING *`, [e_id, related_e_id])

  res.send(createSuccessMessage); 

}))

// Delete record.
router.delete('/:id', [auth, service], async (req, res) => {

  const id = req.params.id
  await db.query(`DELETE FROM ${tableName} WHERE id = $1`, [id])

  res.send(deleteSuccessMessage)

})

// Delete record by event id.
router.delete('/e_id/:e_id', [auth, service], async (req, res) => {

  const id = req.params.e_id
  await db.query(`DELETE FROM ${tableName} WHERE e_id = $1`, [id])

  res.send(deleteSuccessMessage)

})