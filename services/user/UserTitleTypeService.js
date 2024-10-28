const axios = require('axios');

async function findByName(utt_name) {

  const response = await axios.get(`${apiURL}/user-title-type`, { params: {utt_name: utt_name} });
  return response.data;

}

module.exports = {
  findByName
};