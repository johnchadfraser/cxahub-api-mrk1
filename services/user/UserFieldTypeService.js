const axios = require('axios');

async function findByName(uft_name) {

  const response = await axios.get(`${apiURL}/user-field-type`, { params: {uft_name: uft_name} });
  return response.data;

}

module.exports = {
  findByName
};