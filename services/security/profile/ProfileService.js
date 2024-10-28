const axios = require("axios");

async function updateUserAddressRel(user_id, a_id, cntry_id) {
  try {
    //Get the address record.
    const address = await axios.get(`${apiURL}/address`, {
      params: { id: a_id, status_id: 1 },
    });

    if (address.data == "") {
      a_name = "Default";
      a_no = "";
      a_address = "N/A";
      a_address_ext = "";
      a_city = "N/A";
      sp_id = 0;
      cntry_id = cntry_id;
      a_zipcode = "00000";
      a_zipcode_ext = "";
      (at_id = 1), (sort_id = 1), (status_id = 1);

      //Create the address record.
      const response = await axios.post(`${apiURL}/address`, {
        a_name,
        a_no,
        a_address,
        a_address_ext,
        a_city,
        sp_id,
        cntry_id,
        a_zipcode,
        a_zipcode_ext,
        at_id,
        user_id,
        sort_id,
        status_id,
      });

      //Get created record id.
      const a_id = response.data;

      //Create the address relationship.
      await axios.post(`${apiURL}/user-address-rel`, { user_id, a_id });
    } else {
      id = address.data[0].id;
      a_name = address.data[0].a_name;
      a_no = address.data[0].a_no;
      a_address = address.data[0].a_address;
      a_address_ext = address.data[0].a_address_ext;
      a_city = address.data[0].a_city;
      sp_id = address.data[0].sp_id;
      cntry_id = cntry_id;
      a_zipcode = address.data[0].a_zipcode;
      a_zipcode_ext = address.data[0].a_zipcode_ext;
      (at_id = address.data[0].at_id),
        (sort_id = address.data[0].sort_id),
        (status_id = address.data[0].status_id);

      //Update the address record.
      await axios.put(`${apiURL}/address/${id}`, {
        a_name,
        a_no,
        a_address,
        a_address_ext,
        a_city,
        sp_id,
        cntry_id,
        a_zipcode,
        a_zipcode_ext,
        at_id,
        user_id,
        sort_id,
        status_id,
      });
    }
  } catch ({ response, error }) {
    console.error(
      "An error occured in ProfileService for updateUserAddressRel:" +
        error.response.data
    );

    return res.sendStatus(response.status);
  }
}

async function updateUserFieldRel(user_id, uf_id, ufr_value) {
  try {
    //Delete relationship records first.
    await axios.delete(`${apiURL}/user-field-rel/user_id/${user_id}`);

    //Loop over the existing records.
    for (let i in uf_id) {
      let current_uf_id = uf_id[i];
      let current_ufr_value = ufr_value[i];

      //Update the records.
      await axios.post(`${apiURL}/user-field-rel`, {
        user_id,
        uf_id: current_uf_id,
        ufr_value: current_ufr_value,
      });
    }
  } catch ({ response, error }) {
    console.error(
      "An error occured in ProfileService for updateUserFieldRel:" +
        error.response.data
    );

    return res.sendStatus(response.status);
  }
}

async function updateUserBusinessChannelRel(user_id, bc_id) {
  try {
    //Delete relationship records first.
    await axios.delete(
      `${apiURL}/user-business-channel-rel/user_id/${user_id}`
    );

    //Loop over the existing records.
    for (let i in bc_id) {
      let current_bc_id = bc_id[i];

      //Update the records.
      await axios.post(`${apiURL}/user-business-channel-rel`, {
        user_id,
        bc_id: current_bc_id,
      });
    }
  } catch ({ response, error }) {
    console.error(
      "An error occured in ProfileService for updateUserBusinessChannelRel:" +
        error.response.data
    );

    return res.sendStatus(response.status);
  }
}

async function updateUserIndustryRel(user_id, i_id) {
  try {
    //Delete relationship records first.
    await axios.delete(`${apiURL}/user-industry-rel/user_id/${user_id}`);

    //Loop over the existing records.
    for (let i in i_id) {
      let current_i_id = i_id[i];

      //Update the records.
      await axios.post(`${apiURL}/user-industry-rel`, {
        user_id,
        i_id: current_i_id,
      });
    }
  } catch ({ response, error }) {
    console.error(
      "An error occured in ProfileService for updateUserIndustryRel:" +
        error.response.data
    );

    return res.sendStatus(response.status);
  }
}

async function updateUserForumTagRel(user_id, ftag_id) {
  try {
    //Delete relationship records first.
    await axios.delete(`${apiURL}/user-forum-tag-rel/user_id/${user_id}`);

    //Loop over the existing records.
    for (let i in ftag_id) {
      let current_ftag_id = ftag_id[i];

      //Update the records.
      await axios.post(`${apiURL}/user-forum-tag-rel`, {
        user_id,
        ftag_id: current_ftag_id,
      });
    }
  } catch ({ response, error }) {
    console.error(
      "An error occured in ProfileService for updateUserForumTagRel:" +
        error.response.data
    );

    return res.sendStatus(response.status);
  }
}

async function updateUserMemberPreferenceRel(
  user_id,
  um_id,
  up_id,
  umpr_value
) {
  try {
    //Delete relationship records first.
    await axios.delete(
      `${apiURL}/user-member-preference-rel/user_id/${user_id}`
    );

    //Loop over the existing records.
    for (let i in um_id) {
      let current_um_id = um_id[i];

      for (let ii in up_id) {
        let current_up_id = up_id[ii];
        let current_umpr_value = umpr_value[ii];

        //Update the records.
        await axios.post(`${apiURL}/user-member-preference-rel`, {
          user_id,
          um_id: current_um_id,
          up_id: current_up_id,
          umpr_value: current_umpr_value,
        });
      }
    }
  } catch ({ response, error }) {
    console.error(
      "An error occured in ProfileService for updateUserMemberPreferenceRel:" +
        error.response.data
    );

    return res.sendStatus(response.status);
  }
}

async function sendEmailConfirmation(
  user_first_name,
  user_last_name,
  user_email
) {
  try {
    const emailSupport = process.env.FIRESTARTERS_SUPPORT_EMAIL;
    const firestartersWebsiteURL = process.env.FIRESTARTERS_WEBSITE_URL;

    const emailMessage =
      '<a href="' +
      firestartersWebsiteURL +
      '"><img src="cid:firestarters-logo" style="border:none;"/></a><br/><br/>' +
      user_first_name +
      " " +
      user_last_name +
      '. <u>You have successfully updated your profile. Stay tuned for future enhancements and updates to the Firestarters website.</u> <br><br> If you did not update your profile and received this notification, please contact <a href="mailto:' +
      emailSupport +
      '?subject=Firestarters Possible Fraud Alert">' +
      emailSupport +
      '</a> <br><br>Be aware of the many benefits of your profile: <ul><li>Exchange and learn from business stakeholders across the world and across many industries.</li><li>Open environment - we appreciate a diversity of thoughts where there is no right or wrong answer. We value your thoughts and point of views!</li><li>Safe environment as there is no one focused on selling any products / services to you. This community is not used for any commercial purpose.</li><li>Expanding your network with business professionals.</li><li>Problem solve and discuss topics affecting your businesses—not platform related.</li></ul>Return to the Firestarters site <a href="' +
      firestartersWebsiteURL +
      '">click here.<a/>';

    //Create the address record.
    await axios.post(`${apiURL}/email`, {
      to: user_email,
      from: process.env.NOREPLY_EMAIL,
      subject: "Profile Update Confirmation",
      html: emailMessage,
      attachments: [
        {
          filename: "firestarters-logo.png",
          path: "./public/assets/logo/firestarters-logo.png",
          cid: "firestarters-logo",
        },
      ],
    });

    return;
  } catch ({ response, error }) {
    console.error(
      "An error occured in ProfileService for sendEmailConfirmation:" +
        error.response.data
    );

    return res.sendStatus(response.status);
  }
}

module.exports = {
  updateUserAddressRel,
  updateUserFieldRel,
  updateUserBusinessChannelRel,
  updateUserIndustryRel,
  updateUserForumTagRel,
  updateUserMemberPreferenceRel,
  sendEmailConfirmation,
};
