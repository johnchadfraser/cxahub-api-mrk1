const axios = require('axios');

async function findByName(edt_name) {

  const response = await axios.get(`${apiURL}/event-delivery-type`, { params: {edt_name: edt_name} });
  return response.data;

}

module.exports = {
  findByName
};