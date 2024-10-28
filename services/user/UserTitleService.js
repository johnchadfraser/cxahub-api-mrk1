const axios = require('axios');

async function findByName(ut_name) {

  const response = await axios.get(`${apiURL}/user-title`, { params: {ut_name: ut_name} });
  return response.data;

}

module.exports = {
  findByName
};