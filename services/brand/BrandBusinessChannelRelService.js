const axios = require('axios');

async function findByBrandBusinessChannel(b_id, bc_id) {

    const response = await axios.get(`${apiURL}/brand-business-channel-rel`, { params: {b_id: b_id, bc_id: bc_id} });
    return response.data;

  }

  async function deleteBrandBusinessChannelRel(b_id) {

    const response = await axios.delete(`${apiURL}/brand-business-channel-rel/b_id/${b_id}`);
    return response.data;
  
  }
module.exports = {
  findByBrandBusinessChannel,
  deleteBrandBusinessChannelRel
};