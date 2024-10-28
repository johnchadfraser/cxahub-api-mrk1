const axios = require('axios');

async function findByName(apppt_name, baseURL) {

  const response = await axios.get(baseURL, { params: {apppt_name: apppt_name} });
  return response.data;

}

module.exports = {
  findByName
};