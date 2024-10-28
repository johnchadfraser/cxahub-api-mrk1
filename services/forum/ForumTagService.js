const axios = require('axios');

async function findByName(ftag_name) {

  const response = await axios.get(`${apiURL}/forum-tag`, { params: {ftag_name: ftag_name} });
  return response.data;

}

module.exports = {
  findByName
};