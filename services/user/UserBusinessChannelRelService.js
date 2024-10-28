const axios = require('axios');

async function findByUserBusinessChannel(user_id, bc_id) {

    const response = await axios.get(`${apiURL}/user-business-channel-rel`, { params: {user_id: user_id, bc_id: bc_id} });
    return response.data;

  }

module.exports = {findByUserBusinessChannel};