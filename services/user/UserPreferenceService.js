const axios = require('axios');

async function findByName(name) {

    const response = await axios.get(`${apiURL}/user-preference`, { params: {name: name} });
    return response.data;

  }

module.exports = {findByName};