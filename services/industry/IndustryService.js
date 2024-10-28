const axios = require('axios');

async function findByName(i_name) {

  const response = await axios.get(`${apiURL}/industry`, { params: {i_name: i_name} });
  return response.data;

}

module.exports = {
  findByName
};