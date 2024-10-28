const axios = require('axios');

async function findByUserID(user_id) {

  const response = await axios.get(`${apiURL}/user-field-rel`, { params: {user_id: user_id} });

  return response.data;

}

async function findByUserField(user_id, uf_id) {

  const response = await axios.get(`${apiURL}/user-field-rel`, { params: {user_id: user_id, uf_id: uf_id} });
  return response.data;

}

async function deleteUserFieldRel(id) {

  const response = await axios.delete(`${apiURL}/user-field-rel/${id}`);
  return response.data;

}

module.exports = {
  findByUserID,
  findByUserField,
  deleteUserFieldRel,
};