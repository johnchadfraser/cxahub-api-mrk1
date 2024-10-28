const axios = require('axios');

async function findByBrandERPRegion(b_id, erpr_id) {

    const response = await axios.get(`${apiURL}/brand-erp-region-rel`, { params: {b_id: b_id, erpr_id: erpr_id} });
    return response.data;

  }

  async function deleteBrandERPRegionRel(b_id) {

    const response = await axios.delete(`${apiURL}/brand-erp-region-rel/b_id/${b_id}`);
    return response.data;
  
  }
module.exports = {
  findByBrandERPRegion,
  deleteBrandERPRegionRel
};