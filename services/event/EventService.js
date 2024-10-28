const axios = require("axios");

async function findByCanonicalTitle(e_canonical_title, exclude_e_id) {
  const response = await axios.get(`${apiURL}/event`, {
    params: {
      e_canonical_title: e_canonical_title,
      exclude_e_id: exclude_e_id,
    },
  });
  return response.data;
}

async function addEventUserRSVPRel(e_id, user_id) {
  const response = await axios.post(`${apiURL}/event-user-rsvp-rel`, {
    e_id: e_id,
    user_id: user_id,
  });
  return response.data;
}

async function deleteEventUserRSVPRel(e_id, user_id) {
  const response = await axios.delete(
    `${apiURL}/event-user-rsvp-rel/e_id/${e_id}/user_id/${user_id}`
  );
  return response.data;
}

async function deleteEventBusinessChannelRel(e_id) {
  const response = await axios.delete(
    `${apiURL}/event-business-channel-rel/e_id/${e_id}`
  );
  return response.data;
}

async function deleteEventDocumentRel(e_id) {
  const response = await axios.delete(
    `${apiURL}/event-document-rel/e_id/${e_id}`
  );
  return response.data;
}

async function deleteEventIndustryRel(e_id) {
  const response = await axios.delete(
    `${apiURL}/event-industry-rel/e_id/${e_id}`
  );
  return response.data;
}

async function deleteEventRelatedRel(e_id) {
  const response = await axios.delete(
    `${apiURL}/event-related-rel/e_id/${e_id}`
  );
  return response.data;
}

async function deleteEventScheduleRel(e_id) {
  const response = await axios.delete(
    `${apiURL}/event-schedule-rel/e_id/${e_id}`
  );
  return response.data;
}

module.exports = {
  findByCanonicalTitle,
  addEventUserRSVPRel,
  deleteEventUserRSVPRel,
  deleteEventBusinessChannelRel,
  deleteEventDocumentRel,
  deleteEventIndustryRel,
  deleteEventRelatedRel,
  deleteEventScheduleRel,
};
