const axios = require('axios');

async function findByBrandIndustry(b_id, i_id) {

    const response = await axios.get(`${apiURL}/brand-industry-rel`, { params: {b_id: b_id, i_id: i_id} });
    return response.data;

  }

  async function deleteBrandIndustryRel(b_id) {

    const response = await axios.delete(`${apiURL}/brand-industry-rel/b_id/${b_id}`);
    return response.data;
  
  }
module.exports = {
  findByBrandIndustry,
  deleteBrandIndustryRel
};