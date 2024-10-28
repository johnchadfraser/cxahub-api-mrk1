const axios = require("axios");

async function findByUserMember(user_id, um_id) {
  const response = await axios.get(`${apiURL}/user-member-rel`, {
    params: { user_id: user_id, um_id: um_id },
  });
  return response.data;
}

async function findByUserId(user_id) {
  const response = await axios.get(`${apiURL}/user-member-rel`, {
    params: { user_id: user_id },
  });
  return response.data;
}

module.exports = { findByUserMember, findByUserId };
