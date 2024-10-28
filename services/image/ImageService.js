const axios = require('axios');

async function findByName(img_name, baseURL) {

  const response = await axios.get(baseURL, { params: {img_name: img_name} });
  return response.data;

}

module.exports = {
  findByName
};