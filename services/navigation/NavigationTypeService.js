const axios = require('axios');

async function findByName(navt_name, baseURL) {

  const response = await axios.get(baseURL, { params: {navt_name: navt_name} });
  return response.data;

}

module.exports = {
  findByName
};