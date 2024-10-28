const axios = require('axios');

async function findByUserForumTag(user_id, ftag_id) {

  const response = await axios.get(`${apiURL}/user-forum-tag-rel`, { params: {user_id: user_id, ftag_id: ftag_id} });
  return response.data;

}

module.exports = {findByUserForumTag};