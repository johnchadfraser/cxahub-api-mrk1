const axios = require('axios');

async function findByName(sp_name) {

  const response = await axios.get(`${apiURL}/state-prov`, { params: {sp_name: sp_name} });
  return response.data;

}

module.exports = {
  findByName
};