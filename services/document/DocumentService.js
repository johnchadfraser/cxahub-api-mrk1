const axios = require('axios');

async function findByName(doc_name, baseURL) {

  const response = await axios.get(baseURL, { params: {doc_name: doc_name} });
  return response.data;

}

module.exports = {
  findByName
};