const axios = require('axios');

async function findByName(nt_name) {

  const response = await axios.get(`${apiURL}/notification`, { params: {nt_name: nt_name} });
  return response.data;

}

module.exports = {
  findByName
};