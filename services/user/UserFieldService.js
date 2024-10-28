const axios = require('axios');

async function findByName(uf_name) {

  const response = await axios.get(`${apiURL}/user-field`, { params: {uf_name: uf_name} });
  return response.data;

}

module.exports = {
  findByName
};