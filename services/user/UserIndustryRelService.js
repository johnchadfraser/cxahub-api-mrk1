const axios = require('axios');

async function findByUserIndustry(user_id, i_id) {

    const response = await axios.get(`${apiURL}/user-industry-rel`, { params: {user_id: user_id, i_id: i_id} });
    return response.data;

  }

module.exports = {findByUserIndustry};