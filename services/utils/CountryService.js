const axios = require('axios');

async function findByName(cntry_name) {

  const response = await axios.get(`${apiURL}/country`, { params: {cntry_name: cntry_name} });
  return response.data;

}

module.exports = {
  findByName
};