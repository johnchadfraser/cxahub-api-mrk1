const axios = require('axios');

async function findByName(at_name) {

  const response = await axios.get(`${apiURL}/address-type`, { params: {at_name: at_name} });
  return response.data;

}

module.exports = {
  findByName
};