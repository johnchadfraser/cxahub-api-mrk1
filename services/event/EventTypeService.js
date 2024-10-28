const axios = require('axios');

async function findByName(et_name) {

  const response = await axios.get(`${apiURL}/event-type`, { params: {et_name: et_name} });
  return response.data;

}

module.exports = {
  findByName
};