const axios = require('axios');

async function findByName(time_name) {

  const response = await axios.get(`${apiURL}/time`, { params: {time_name: time_name} });
  return response.data;

}

module.exports = {
  findByName
};