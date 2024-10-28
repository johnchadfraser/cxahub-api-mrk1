const axios = require('axios');

async function findByUserAddress(user_id, a_id) {

    const response = await axios.get(`${apiURL}/user-address-rel`, { params: {user_id: user_id, a_id: a_id} });
    return response.data;

}

async function findByUserEmail(user_email) {

  const response = await axios.get(`${apiURL}/user-address-rel`, { params: {user_email: user_email} });
  return response.data;

}

module.exports = {findByUserAddress,findByUserEmail};