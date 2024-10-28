const axios = require('axios');

async function findByName(status_name) {

  const response = await axios.get(`${apiURL}/status`, { params: {status_name: status_name} });
  return response.data;

}

module.exports = {
  findByName
};