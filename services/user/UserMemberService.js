const axios = require('axios');

async function findByName(name) {

    const response = await axios.get(`${apiURL}/user-member`, { params: {name: name} });
    return response.data;

  }

module.exports = {findByName};