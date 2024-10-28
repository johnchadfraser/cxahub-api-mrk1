const axios = require('axios');

async function findByName(appt_name, baseURL) {

  const response = await axios.get(baseURL, { params: {appt_name: appt_name} });
  return response.data;

}

module.exports = {
  findByName
};