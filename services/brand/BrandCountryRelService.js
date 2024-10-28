const axios = require('axios');

async function findByBrandCountry(b_id, cntry_id) {

    const response = await axios.get(`${apiURL}/brand-country-rel`, { params: {b_id: b_id, cntry_id: cntry_id} });
    return response.data;

  }

  async function deleteBrandCountryRel(b_id) {

    const response = await axios.delete(`${apiURL}/brand-country-rel/b_id/${b_id}`);
    return response.data;
  
  }
module.exports = {
  findByBrandCountry,
  deleteBrandCountryRel
};