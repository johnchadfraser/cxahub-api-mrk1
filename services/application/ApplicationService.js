const axios = require('axios');

async function findByName(app_name, baseURL) {

  const response = await axios.get(baseURL, { params: {app_name: app_name} });
  return response.data;

}

module.exports = {
  findByName
};