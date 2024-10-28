const axios = require('axios');

async function findByName(appp_name, baseURL) {

  const response = await axios.get(baseURL, { params: {appp_name: appp_name} });
  return response.data;

}

module.exports = {
  findByName
};