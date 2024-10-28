const axios = require('axios');

async function findByName(bc_name) {

  const response = await axios.get(`${apiURL}/business-channel`, { params: {bc_name: bc_name} });
  return response.data;

}

module.exports = {
  findByName
};