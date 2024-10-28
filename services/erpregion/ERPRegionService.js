const axios = require('axios');

async function findByName(erpr_name) {

  const response = await axios.get(`${apiURL}/erp-region`, { params: {erpr_name: erpr_name} });
  return response.data;

}

module.exports = {
  findByName
};