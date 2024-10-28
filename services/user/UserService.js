const axios = require("axios");

async function addUserSecurityKeyRel(user_id, user_password) {
  //First encrypt password.
  const passwordgen = await axios.get(`${apiURL}/passwordgen/` + user_password);
  //Create the security key record of type password.
  const security_key_id = await axios.post(`${apiURL}/security-key`, {
    user_id: user_id,
    sk_value: passwordgen.data,
    skt_id: 1,
  });
  //Create the user security key rel record.
  const response = await axios.post(`${apiURL}/user-security-key-rel`, {
    user_id: user_id,
    sk_id: security_key_id.data,
  });

  return response.data;
}

async function findByEmail(user_email, exclude_user_id) {
  const response = await axios.get(`${apiURL}/user`, {
    params: { user_email: user_email, exclude_user_id: exclude_user_id },
  });

  return response.data;
}

async function findUserSecurityKeyByEmail(
  user_email,
  sk_value,
  user_date_exp,
  status_id
) {
  const response = await axios.get(`${apiURL}/user-security-key-rel`, {
    params: {
      user_email: user_email,
      sk_value: sk_value,
      user_date_exp: user_date_exp,
      status_id: status_id,
    },
  });
  return response.data;
}

async function findUserSecurityKeyByID(user_id) {
  const response = await axios.get(`${apiURL}/user-security-key-rel`, {
    params: { user_id: user_id },
  });
  return response.data;
}

async function addUserBusinessChannelRel(user_id, bc_id) {
  const response = await axios.post(`${apiURL}/user-business-channel-rel`, {
    user_id: user_id,
    bc_id: bc_id,
  });
  return response.data;
}

async function addUserIndustryRel(user_id, i_id) {
  const response = await axios.post(`${apiURL}/user-industry-rel`, {
    user_id: user_id,
    i_id: i_id,
  });
  return response.data;
}

async function addUserAddressRel(user_id, a_id) {
  const response = await axios.post(`${apiURL}/user-address-rel`, {
    user_id: user_id,
    a_id: a_id,
  });
  return response.data;
}

async function addUserERPRegionRel(user_id, erpr_id) {
  const response = await axios.post(`${apiURL}/user-erp-region-rel`, {
    user_id: user_id,
    erpr_id: erpr_id,
  });
  return response.data;
}

async function addUserMemberRel(user_id, um_id) {
  const response = await axios.post(`${apiURL}/user-member-rel`, {
    user_id: user_id,
    um_id: um_id,
  });
  return response.data;
}

async function addUserMemberPreferenceRel(user_id, um_id, up_id, umpr_value) {
  //Convert values to arrays.
  const up_id_arr = up_id.split(",").map((element) => {
    return Number(element);
  });

  const umpr_value_arr = umpr_value.split(",").map((element) => {
    return Boolean(element);
  });

  //Check for valid arrays.
  if (Array.isArray(up_id_arr) && Array.isArray(umpr_value_arr)) {
    //Create member preferences loop over selected options.
    up_id_arr.forEach(function (number, index) {
      //Get the value by index.
      var umprValue = umpr_value_arr.at(index);

      axios.post(`${apiURL}/user-member-preference-rel`, {
        user_id: user_id,
        um_id: um_id,
        up_id: number,
        umpr_value: umprValue,
      });
    });
  }
}

async function deleteUserSecurityKeyRel(user_id) {
  //Get the seurity key id.
  const checkExist = await findUserSecurityKeyByID(user_id);

  if (checkExist != "") {
    const sk_id = checkExist[0].sk_id;

    //Delete the security key rel.
    const response = await axios.delete(
      `${apiURL}/user-security-key-rel/user_id/${user_id}`
    );

    //Delete the security key in this process.
    await axios.delete(`${apiURL}/security-key/${sk_id}`);
  }
}

async function deleteUserBusinessChannelRel(user_id) {
  const response = await axios.delete(
    `${apiURL}/user-business-channel-rel/user_id/${user_id}`
  );
  return response.data;
}

async function deleteUserIndustryRel(user_id) {
  const response = await axios.delete(
    `${apiURL}/user-industry-rel/user_id/${user_id}`
  );
  return response.data;
}

async function deleteUserAddressRel(user_id) {
  const response = await axios.delete(
    `${apiURL}/user-address-rel/user_id/${user_id}`
  );

  //Delete the address records for the user.
  await axios.delete(`${apiURL}/address/user_id/${user_id}`);

  return response.data;
}

async function deleteUserERPRegionRel(user_id) {
  const response = await axios.delete(
    `${apiURL}/user-erp-region-rel/user_id/${user_id}`
  );
  return response.data;
}

async function deleteUserMemberRel(user_id) {
  const response = await axios.delete(
    `${apiURL}/user-member-rel/user_id/${user_id}`
  );
  return response.data;
}

async function deleteUserMemberPreferenceRel(user_id) {
  const response = await axios.delete(
    `${apiURL}/user-member-preference-rel/user_id/${user_id}`
  );
  return response.data;
}

async function deleteUserMemberPreferenceRelByIDs(user_id, um_id, up_id) {
  const response = await axios.delete(
    `${apiURL}/user-member-preference-rel/user_id/${user_id}/${um_id}/${up_id}`
  );
  return response.data;
}

async function deleteUserCommentLikeUserRel(user_id) {
  const response = await axios.delete(
    `${apiURL}/user-comment-like/user_id/${user_id}`
  );
  return response.data;
}

async function deleteUserCommentShareUserRel(user_id) {
  const response = await axios.delete(
    `${apiURL}/user-comment-share/user_id/${user_id}`
  );
  return response.data;
}

async function deleteUserComment(user_id) {
  const response = await axios.delete(
    `${apiURL}/user-comment/user_id/${user_id}`
  );
  return response.data;
}

module.exports = {
  findByEmail,
  findUserSecurityKeyByEmail,
  findUserSecurityKeyByID,
  addUserSecurityKeyRel,
  addUserBusinessChannelRel,
  addUserAddressRel,
  addUserIndustryRel,
  addUserERPRegionRel,
  addUserMemberRel,
  addUserMemberPreferenceRel,
  deleteUserSecurityKeyRel,
  deleteUserBusinessChannelRel,
  deleteUserAddressRel,
  deleteUserIndustryRel,
  deleteUserERPRegionRel,
  deleteUserMemberRel,
  deleteUserMemberPreferenceRel,
  deleteUserMemberPreferenceRelByIDs,
  deleteUserCommentLikeUserRel,
  deleteUserCommentShareUserRel,
  deleteUserComment,
};
