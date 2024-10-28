const axios = require('axios');

async function findByName(it_name) {

  const response = await axios.get(`${apiURL}/information-type`, { params: {it_name: it_name} });
  return response.data;

}

module.exports = {
  findByName
};