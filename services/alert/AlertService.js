const axios = require('axios');

async function findByName(a_name) {

  const response = await axios.get(`${apiURL}/alert`, { params: {a_name: a_name} });
  return response.data;

}

module.exports = {
  findByName
};