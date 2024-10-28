const axios = require('axios');

async function findByUserID(user_id) {

  const response = await axios.get(`${apiURL}/user-security-key-rel`, { params: {user_id: user_id} });

  return response.data;

}

async function findUserSecurityKeyByLogin(user_email, user_date_exp, status_id) {

  const response = await axios.get(`${apiURL}/user-security-key-rel`, { params: {user_email: user_email, user_date_exp: user_date_exp, status_id: status_id} });
  return response.data;

}

async function deleteUserSecurityKey(id) {

  const response = await axios.delete(`${apiURL}/user-security-key-rel/${id}`);
  return response.data;

}

module.exports = {
  findByUserID,
  findUserSecurityKeyByLogin,
  deleteUserSecurityKey,
};