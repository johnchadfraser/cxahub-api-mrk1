const axios = require("axios");
const request = require("request");

//Set services used by route.
const UserAddressRelService = require("../../../services/user/UserAddressRelService");

async function addUserRegister(data) {
  //Set options for request.
  let options = {
    method: "POST",
    url: process.env.API_URL + "/" + process.env.API_REGISTER_ROUTE,
    body: {
      user_first_name: data.firstName,
      user_last_name: data.lastName,
      user_email: data.email,
      user_company: data.companyName,
      cntry_id: data.cntry_id,
      user_password: data.password,
      register_source: data.register_source,
    },
    json: true,
  };

  //Register user.
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      return body;
    } else if (error) {
      return error;
    } else {
      return "There was a problem with the Register User API: " + error;
    }
  });
}

async function addUserRegisterFromSignIn(data) {
  //Get user data.
  let userData = "";
  let password = "";
  if (data.uName) {
    //Flash Sign In.
    userData = await UserAddressRelService.findByUserEmail(data.uName);
    password = data.pass;
  } else if (data.user_email) {
    //Firestarters Sign In.
    userData = await UserAddressRelService.findByUserEmail(data.user_email);
    password = data.user_password;
  }
  if (userData.length != 0) {
    //Set options for request.
    let options = {
      method: "POST",
      url: process.env.API_URL + "/" + process.env.API_REGISTER_ROUTE,
      body: {
        user_first_name: userData[0].user_first_name,
        user_last_name: userData[0].user_last_name,
        user_email: userData[0].user_email,
        user_company: userData[0].user_company,
        cntry_id: userData[0].cntry_id,
        user_password: password,
        register_source: data.register_source,
        email_confirmation: data.email_confirmation,
      },
      json: true,
    };

    //Register user.
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        return body;
      } else if (error) {
        return error;
      } else {
        return "There was a problem with the Register User API: " + error;
      }
    });
  }
}

async function addAddressCountry(user_id, cntry_id) {
  a_name = "Default";
  a_no = "";
  a_address = "N/A";
  a_address_ext = "";
  a_city = "N/A";
  sp_id = 0;
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

  return response.data;
}

async function sendEmailConfirmation(
  user_first_name,
  user_last_name,
  user_email,
  register_source,
  register_event = ""
) {
  if (register_source === "Firestarters") {
    const emailSupport = process.env.FIRESTARTERS_SUPPORT_EMAIL;
    const websiteURL = process.env.FIRESTARTERS_WEBSITE_URL;

    const emailMessage =
      '<a href="' +
      websiteURL +
      '"><img src="cid:firestarters-logo" style="border:none;"/></a><br/><br/>Thanks for registering ' +
      user_first_name +
      " " +
      user_last_name +
      '. <u>Congratulations, you are now registered. Stay tuned for future enhancements and updates to the Firestarters website.</u> <br><br> Be aware of the many benefits of registering: <ul><li>Exchange and learn from business stakeholders across the world and across many industries.</li><li>Open environment - we appreciate a diversity of thoughts where there is no right or wrong answer. We value your thoughts and point of views!</li><li>Safe environment as there is no one focused on selling any products / services to you. This community is not used for any commercial purpose.</li><li>Expanding your network with business professionals.</li><li>Problem solve and discuss topics affecting your businesses—not platform related.</li></ul>Return to the Firestarters site <a href="' +
      websiteURL +
      '">click here.<a/><br/><br/>For support or to adjust your profile please contact <a href="mailto:' +
      emailSupport +
      '?subject=Firestarters Registration Inquiry">' +
      emailSupport +
      "</a> or visit the Firestarters site and Sign In to update your profile.";

    //Create the address record.
    const response = await axios.post(`${apiURL}/email`, {
      to: user_email,
      from: process.env.NOREPLY_EMAIL,
      subject: "Registration Confirmation",
      html: emailMessage,
      attachments: [
        {
          filename: "firestarters-logo.png",
          path: "./public/assets/logo/firestarters-logo.png",
          cid: "firestarters-logo",
        },
      ],
    });
  } else if (register_source === "Firestarters Event") {
    const emailSupport = process.env.FIRESTARTERS_SUPPORT_EMAIL;
    const websiteURL = process.env.FIRESTARTERS_WEBSITE_URL;

    const emailMessage =
      '<a href="' +
      websiteURL +
      '"><img src="cid:firestarters-logo" style="border:none;"/></a><br/><br/>Thanks for your interest in ' +
      register_event +
      " " +
      user_first_name +
      " " +
      user_last_name +
      '. <br/><br/><u>We have received your registration and are currently reviewing it.</u> <br/><br/> Expect to hear from us shortly with further details. Stay tuned for an exciting journey ahead! <br/><br/>Return to the Firestarters site <a href="' +
      websiteURL +
      '">click here.<a/><br/><br/>For support or to adjust your profile please contact <a href="mailto:' +
      emailSupport +
      "?subject=Firestarters " +
      register_event +
      ' Registration Inquiry">' +
      emailSupport +
      "</a> or visit the Firestarters site and Sign In to update your profile.";

    //Create the address record.
    const response = await axios.post(`${apiURL}/email`, {
      to: user_email,
      from: process.env.NOREPLY_EMAIL,
      bcc: process.env.FIRESTARTERS_SUPPORT_EMAIL,
      subject: register_event + " Registration Confirmation",
      html: emailMessage,
      attachments: [
        {
          filename: "firestarters-logo.png",
          path: "./public/assets/logo/firestarters-logo.png",
          cid: "firestarters-logo",
        },
      ],
    });
  } else if (register_source === "Flash") {
    const emailSupport = process.env.FLASH_SUPPORT_EMAIL;
    const websiteURL = process.env.FLASH_WEBSITE_URL;
    const firestartersWebsiteURL = process.env.FIRESTARTERS_WEBSITE_URL;
    const flashFeedbackSurveyURL = process.env.FLASH_FEEDBACK_SURVEY_URL;

    const emailMessage =
      '<a href="' +
      websiteURL +
      '"><img src="cid:flash-logo" style="border:none;"/></a><br/><br/>Thanks for registering ' +
      user_first_name +
      " " +
      user_last_name +
      '. <u>Congratulations, you are now registered. Stay tuned for future enhancements and updates to the Flash website.</u> <br><br> Be aware of the many benefits of registering: <ul><li><a href="' +
      websiteURL +
      '/request">Connect with an expert</a> to review the results with you, and dive deeper into best practices.</li><li><a href="' +
      flashFeedbackSurveyURL +
      '/request">Share your experience</a> and how we can do better!</li><li>Explore the <a href="' +
      firestartersWebsiteURL +
      '">Firestarters Community</a> with insights, events, and tools like this FLASH Enterprise Assessment. Unlock value and drive your business forward.</li></ul>Return to the FLASH site <a href="' +
      websiteURL +
      '">click here.<a/><br/><br/>For support please contact <a href="mailto:' +
      emailSupport +
      '?subject=FLASH Registration Inquiry">' +
      emailSupport +
      "</a> or visit the Flash site.";

    //Create the address record.
    const response = await axios.post(`${apiURL}/email`, {
      to: user_email,
      from: process.env.NOREPLY_EMAIL,
      subject: "Registration Confirmation",
      html: emailMessage,
      attachments: [
        {
          filename: "flash-logo.png",
          path: "./public/assets/logo/flash-logo.png",
          cid: "flash-logo",
        },
      ],
    });
  }

  return;
}

module.exports = {
  addUserRegister,
  addUserRegisterFromSignIn,
  addAddressCountry,
  sendEmailConfirmation,
};
