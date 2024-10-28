const axios = require('axios');

async function findByName(doct_name) {

  const response = await axios.get(`${apiURL}/document-type`, { params: {doct_name: doct_name} });
  return response.data;

}

module.exports = {
  findByName
};