const axios = require('axios');

async function findByName(mc_name) {

  const response = await axios.get(`${apiURL}/mobile-carrier`, { params: {mc_name: mc_name} });
  return response.data;

}

module.exports = {
  findByName
};