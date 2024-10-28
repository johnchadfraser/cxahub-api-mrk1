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
const tableName = 'cxahub.t_security_key';
const viewName = 'cxahub.v_security_key';
const orderBy = '';

//Set messaging.
const createSuccessMessage = 'You have created the security key successfully.';
const updateSuccessMessage = 'You have updated the security key successfully.';
const deleteSuccessMessage = 'You have deleted the security key successfully.';

//Set services used by route.
const UserSecurityKeyRelService = require('../../../services/user/UserSecurityKeyRelService');

//Enable wrap for async.
const wrap = require('express-async-wrap');
//Get all records.
router.get('/', [auth, service], cache(cachMins), async (req, res) => {

  try {


    let qry = `SELECT * FROM ${tableName} WHERE 0=0`;

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

  const { user_id, sk_value, skt_id } = req.body

  //Check if record exists.
  const checkExist = await UserSecurityKeyRelService.findByUserID(user_id);

  //If record exists delete it.
  if(checkExist != '') {

    //Delete security key.
    await UserSecurityKeyRelService.deleteUserSecurityKey(checkExist[0].sk_id);

  }

  const { rows } = await db.query(`INSERT INTO ${tableName} (sk_value, skt_id) VALUES ($1, $2) RETURNING *`, [sk_value, skt_id])
  const id = rows[0].id;
  res.send(id);
  
}

))

// Update record.
router.put('/:id', [auth, service], async (req, res) => {

  const id = req.params.id
  const { sk_value, skt_id } = request.body
  const { rows } = await db.query(`UPDATE ${tableName} SET sk_value = $2, skt_id = $3 WHERE id = $1`, [sk_value, skt_id])

  res.send(updateSuccessMessage);

})

// Delete record.
router.delete('/:id', [auth, service], async (req, res) => {

  const id = req.params.id
  await db.query(`DELETE FROM ${tableName} WHERE id = $1`, [id])

  res.send(deleteSuccessMessage)

})