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
const tableName = 'cxahub.t_event';
const viewName = 'cxahub.v_event';
const orderBy = 'ORDER BY e_date DESC';

//Set messaging.
const createSuccessMessage = 'You have created the event successfully.';
const updateSuccessMessage = 'You have updated the event successfully.';
const deleteSuccessMessage = 'You have deleted the event successfully.';

//Set services used by route.
const EventService = require('../../../services/event/EventService');
const Regex = require('../../../services/regex/Regex');

//Enable wrap for async.
const wrap = require('express-async-wrap');

//Get all records.
router.get('/', [auth, service], cache(cachMins), async (req, res) => {

  try {

    let qry = `SELECT * FROM ${viewName} WHERE 0=0`;

    //Filter by keywords.
    if(req.query.kw) {

      //Convert keywords into an array with a space delimeter.
      const kw_arr = req.query.kw.split(' ').map(element => {
        return String(element);
      });

      //Check if is a valid array.
      if(Array.isArray(kw_arr)) {

        //Loop over keywords.
        kw_arr.forEach(function(keyword, index){

          //Set operator for kw looped query.
          sqlOperator = 'AND'
          if (index != 0) {
            sqlOperator = 'OR'
          }

          qry = qry + ` ${sqlOperator} (UPPER(e_title) LIKE '%${keyword.trim().toUpperCase()}%')`;

        });

      }

    }

    //Event id.
    if(req.query.id) {

      qry = qry + ` AND id = '${req.query.id}'`;

    }

    //Exclude event id.
    if(req.query.exclude_e_id) {

      qry = qry + ` AND id <> '${req.query.exclude_e_id}'`;

    }

    //Filter by title.
    if(req.query.e_title) {

      qry = qry + ` AND UPPER(e_title) = '${req.query.e_title.trim().toUpperCase()}'`;

    }

    //Filter by canonical title.
    if(req.query.e_canonical_title) {

        qry = qry + ` AND UPPER(e_canonical_title) = '${req.query.e_canonical_title.trim().toUpperCase()}'`;
  
    }

    //Filter by date lt.
    if(req.query.e_date_lt) {

      qry = qry + ` AND (e_date < '${req.query.e_date_lt}')`;
  
    }

    //Filter by date gte.
    if(req.query.e_date_gte) {

      qry = qry + ` AND (e_date >= '${req.query.e_date_gte}')`;
  
    }

    //Filter by date of release.
    if(req.query.e_date_rel) {

      qry = qry + ` AND (e_date_rel <= '${req.query.e_date_rel}' OR e_date_rel = '1900-01-01')`;
  
    }

    //Filter by date of expiration.
    if(req.query.e_date_exp) {

      qry = qry + ` AND (e_date_exp > '${req.query.e_date_exp}' OR e_date_exp = '1900-01-01')`;

    }

    //Filter by event type.
    if(req.query.et_id) {

      qry = qry + ` AND et_id = '${req.query.et_id}'`;

    }

    //Filter by event delivery type.
    if(req.query.edt_id) {

      qry = qry + ` AND edt_id = '${req.query.edt_id}'`;

    }

    //Filter by status.
    if(req.query.status_id) {

      qry = qry + ` AND status_id = '${req.query.status_id}'`;

    }

    //Order by.
    if(req.query.order_by) {

      qry = qry + ` ORDER BY ${req.query.order_by}`;

    } else if (orderBy != '') {

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
    res.send(rows)

  } catch ({ response }) {

    return res.sendStatus(response.status);

  }

})

// Create record.
router.post('/', [auth, service], wrap(async function(req, res) {
    
  const { e_title, e_description, e_note, e_tag, e_url, e_map_url, e_address, e_city, sp_id, cntry_id, e_zipcode, e_date, e_date_rel, e_date_exp, time_id_start, time_id_end, img_id, et_id, edt_id, host_user_id, user_id, sort_id, status_id } = req.body

  //Set e_canonical_title.
  const e_canonical_title = Regex.canonicalText(e_title);

  //Check if record exists.
  const checkExist = await EventService.findByCanonicalTitle(e_canonical_title, 0);

  //If record exists, do not post.
  if(checkExist != '') {

    res.send(`Event already exists: ${e_canonical_title}`);

  } else {

    const { rows } = await db.query(`INSERT INTO ${tableName} (e_title, e_canonical_title, e_description, e_note, e_tag, e_url, e_map_url, e_address, e_city, sp_id, cntry_id, e_zipcode, e_date, e_date_rel, e_date_exp, time_id_start, time_id_end, img_id, et_id, edt_id, host_user_id, user_id, sort_id, status_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24) RETURNING *`, [e_title, e_canonical_title, e_description, e_note, e_tag, e_url, e_map_url, e_address, e_city, sp_id, cntry_id, e_zipcode, e_date, e_date_rel, e_date_exp, time_id_start, time_id_end, img_id, et_id, edt_id, host_user_id, user_id, sort_id, status_id])

    const id = rows[0].id; 

    res.send(createSuccessMessage); 

  }

}))

// Update record.
router.put('/:id', [auth, service], async (req, res) => {

  const { id } = req.params
  const { e_title, e_description, e_note, e_tag, e_url, e_map_url, e_address, e_city, sp_id, cntry_id, e_zipcode, e_date, e_date_rel, e_date_exp, time_id_start, time_id_end, img_id, et_id, edt_id, host_user_id, user_id, sort_id, status_id } = req.body

  //Set e_canonical_title.
  const e_canonical_title = regex.canonicalText(e_title);

  //Check if record exists.
  const checkExist = await EventService.findByCanonicalTitle(e_canonical_title, id);

  if(checkExist != '') {

    res.send(`Event canonical title already exists: ${e_canonical_title}.`);

  } else {

    const { rows } = await db.query(`UPDATE ${tableName} SET e_title = $2, e_canonical_title = $3, e_description = $4, e_note = $5, e_tag = $6, e_url = $7, e_map_url = $8, e_address = $9, e_city = $10, sp_id = $11, cntry_id = $12, e_zipcode = $13, e_time_updated = now(), e_date = 14$, e_date_rel = $15, e_date_exp = $16, time_id_start = $17, time_id_end = $18, img_id = $19, et_id = $20, edt_id = $21, host_user_id = $22, user_id = $23, sort_id = $24, status_id = $25 WHERE id = $1`, [id, e_title, e_canonical_title, e_description, e_note, e_tag, e_url, e_map_url, e_address, e_city, sp_id, cntry_id, e_zipcode, e_date, e_date_rel, e_date_exp, time_id_start, time_id_end, img_id, et_id, edt_id, host_user_id, user_id, sort_id, status_id])

    res.send(updateSuccessMessage)
  }

})

// Delete record.
router.delete('/:id', [auth, service], wrap(async function(req, res) {

  const { id } = req.params
  const { rows } = await db.query(`DELETE FROM ${tableName} WHERE id = $1`, [id])

  //Delete relationship records.
  await EventService.deleteEventBusinessChannelRel(id);
  await EventService.deleteEventDocumentRel(id);
  await EventService.deleteEventIndustryRel(id);
  await EventService.deleteEventRelatedRel(id);
  await EventService.deleteEventScheduleRel(id); 

  res.send(deleteSuccessMessage)

}))