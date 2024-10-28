const axios = require('axios');

async function findByName(u_type_name) {

  const response = await axios.get(`${apiURL}/user-type`, { params: {u_type_name: u_type_name} });
  return response.data;

}

module.exports = {
  findByName
};