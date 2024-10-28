const axios = require('axios');

async function findByName(nav_name, baseURL) {

  const response = await axios.get(baseURL, { params: {nav_name: nav_name} });
  return response.data;

}

module.exports = {
  findByName
};