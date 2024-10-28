const axios = require("axios");

async function findByEmail(user_email) {
  const response = await axios.get(`${apiURL}/emarsys/contact`, {
    params: { email: user_email },
  });
  return response.data;
}

async function addRegistrationContact(
  user_id,
  user_first_name,
  user_last_name,
  user_email,
  u_type_id,
  um_id,
  cntry_id,
  user_company,
  register_source
) {
  try {
    //Check if user exists.
    const checkExists = await findByEmail(user_email);
    let response = {};

    //Create the record if it doesn't exist.
    if (checkExists === "false") {
      response = await axios.post(`${apiURL}/emarsys/contact`, {
        user_id: user_id,
        user_first_name: user_first_name,
        user_last_name: user_last_name,
        user_email: user_email,
        u_type_id: u_type_id,
        um_id: um_id,
        cntry_id: cntry_id,
        user_company: user_company,
        register_source,
      });
      //Update the record if exists.
    } else {
      response = await axios.put(`${apiURL}/emarsys/contact/update`, {
        key_id: 3,
        user_id: user_id,
        user_first_name: user_first_name,
        user_last_name: user_last_name,
        user_email: user_email,
        u_type_id: u_type_id,
        um_id: um_id,
        cntry_id: cntry_id,
        user_company: user_company,
        register_source,
      });
    }
    return response.data;
  } catch ({ response, error }) {
    console.error(
      "An error occured in EmarsysService for addRegistrationContact" + error
    );

    return res.sendStatus(response.status);
  }
}

async function updateRegistrationContact(
  user_first_name,
  user_last_name,
  user_email,
  user_company,
  cntry_id,
  bc_id,
  i_id,
  um_id,
  up_id,
  umpr_value
) {
  try {
    const response = await axios.post(`${apiURL}/emarsys/contact`, {
      key_id: 3,
      user_first_name: user_first_name,
      user_last_name: user_last_name,
      user_email: user_email,
      user_company: user_company,
      cntry_id: cntry_id,
      bc_id: bc_id,
      i_id: i_id,
      um_id: um_id,
      up_id: up_id,
      umpr_value: umpr_value,
    });

    return response.data;
  } catch ({ response, error }) {
    console.error(
      "An error occured in EmarsysService for updateRegistrationContact" +
        error.response.data
    );

    return res.sendStatus(response.status);
  }
}

//New Firestarters Nuxt3 version.
async function updateRegistrationUser(
  user_first_name,
  user_last_name,
  user_email,
  user_company,
  cntry_id
) {
  try {
    const response = await axios.post(`${apiURL}/emarsys/contact`, {
      key_id: 3,
      user_first_name: user_first_name,
      user_last_name: user_last_name,
      user_email: user_email,
      user_company: user_company,
      cntry_id: cntry_id,
    });

    return response.data;
  } catch ({ response, error }) {
    console.error(
      "An error occured in EmarsysService for updateRegistrationUser" +
        error.response.data
    );

    return res.sendStatus(response.status);
  }
}

async function getERPByCountry(cntry_id) {
  try {
    const response = await axios.get(`${apiURL}/country`, {
      params: { id: cntry_id },
    });

    return response.data[0].erpr_id;
  } catch ({ response, error }) {
    console.error(
      "An error occured in EmarsysService for getERPByCountry" +
        error.response.data
    );

    return res.sendStatus(response.status);
  }
}

module.exports = {
  addRegistrationContact,
  updateRegistrationContact,
  getERPByCountry,
  findByEmail,
};
