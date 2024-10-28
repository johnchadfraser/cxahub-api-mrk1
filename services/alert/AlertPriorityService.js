const axios = require('axios');

async function findByName(ap_name) {

  const response = await axios.get(`${apiURL}/alert-priority`, { params: {ap_name: ap_name} });
  return response.data;

}

module.exports = {
  findByName
};