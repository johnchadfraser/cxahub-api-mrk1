const axios = require('axios');

async function findByName(imgt_name) {

  const response = await axios.get(`${apiURL}/image-type`, { params: {imgt_name: imgt_name} });
  return response.data;

}

module.exports = {
  findByName
};