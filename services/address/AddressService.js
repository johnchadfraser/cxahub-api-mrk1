const axios = require('axios');

async function findByNameUserID(a_name, user_id) {

  const response = await axios.get(`${apiURL}/address`, { params: {a_name: a_name, user_id: user_id} });
  return response.data;

}

module.exports = {
  findByNameUserID
};