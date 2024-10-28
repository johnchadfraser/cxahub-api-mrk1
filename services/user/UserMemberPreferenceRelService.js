const axios = require('axios');

async function findByUserMemberPreference(user_id, um_id, up_id) {

    const response = await axios.get(`${apiURL}/user-member-preference-rel`, { params: {user_id: user_id, um_id: um_id, up_id: up_id} });
    return response.data;

  }

module.exports = {findByUserMemberPreference};