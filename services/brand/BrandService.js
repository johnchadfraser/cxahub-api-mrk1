const axios = require('axios');

async function findByName(b_name) {

  const response = await axios.get(`${apiURL}/brand`, { params: {b_name: b_name} });
  return response.data;

}

module.exports = {
  findByName
};