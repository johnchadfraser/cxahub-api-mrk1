const axios = require('axios');

async function findByName(logt_name) {

  const response = await axios.get(`${apiURL}/log-type`, { params: {logt_name: logt_name} });
  return response.data;

}

module.exports = {
  findByName
};