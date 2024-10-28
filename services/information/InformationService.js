const axios = require('axios');

async function findByName(i_description) {

  const response = await axios.get(`${apiURL}/information`, { params: {i_description: i_description} });
  return response.data;

}

module.exports = {
  findByName
};