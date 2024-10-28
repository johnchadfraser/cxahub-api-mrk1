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
const tableName = 'cxahub.t_user_member';
const viewName = 'cxahub.v_user_member';
const orderBy = 'ORDER BY sort_id ASC';

//Set services used by route.
const UserMemberService = require('../../../services/user/UserMemberService');

//Enable wrap for async.
const wrap = require('express-async-wrap');
//Get all records.
router.get('/', [auth, service], cache(cachMins), async (req, res) => {

  try {

    let qry = `SELECT * FROM ${viewName} WHERE 0=0`;

    if(req.query.id) {

      qry = qry + ` AND id = '${req.query.id}'`;

    }

    if(req.query.name) {

      qry = qry + ` AND UPPER(um_name) = '${req.query.name.toUpperCase()}'`;

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
    
  const { um_name, sort_id, status_id } = req.body

  //Check if record exists.
  const checkExist = await UserMemberService.findByName(um_name);

  //If record exists, do not post.
  if(checkExist != '') {

    res.send(`Member already exists: ${um_name}`)

  } else {

    const { rows } = await db.query(`INSERT INTO ${tableName} (um_name, sort_id, status_id) VALUES ($1, $2, $3) RETURNING *`, [um_name, sort_id, status_id])

    const id = rows[0].id;
    res.send(`Record added with ID: ${rows[0].id}`); 

    //TODO: Create relationship records.

  }

}))

// Update record.
router.put('/:id', [auth, service], async (req, res) => {
  const { id } = req.params
  const { um_name, sort_id, status_id } = req.body
  const { rows } = await db.query(`UPDATE ${tableName} SET um_name = $2, um_time_updated = now(), sort_id = $3, status_id = $4  WHERE id = $1`, [id, um_name, sort_id, status_id])
  res.send(`Record modified with ID: ${id}`)
})

// Delete record.
router.delete('/:id', [auth, service], async (req, res) => {
  const id = parseInt(req.params.id)
  const { rows } = await db.query(`DELETE FROM ${tableName} WHERE id = $1`, [id])
  res.send(`Record deleted with ID: ${id}`)
})