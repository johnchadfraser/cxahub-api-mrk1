const axios = require('axios');

async function findByUserERPRegion(user_id, erpr_id) {

    const response = await axios.get(`${apiURL}/user-erp-region-rel`, { params: {user_id: user_id, erpr_id: erpr_id} });
    return response.data;

  }

module.exports = {findByUserERPRegion};