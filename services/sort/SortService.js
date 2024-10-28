const axios = require('axios');

async function findByName(sort_name) {

  const response = await axios.get(`${apiURL}/sort`, { params: {sort_name: sort_name} });
  return response.data;

}

module.exports = {
  findByName
};