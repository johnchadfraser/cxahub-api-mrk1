const axios = require("axios");

async function findByCanonicalTitle(c_canonical_title, exclude_c_id) {
  const response = await axios.get(`${apiURL}/content`, {
    params: {
      c_canonical_title: c_canonical_title,
      exclude_c_id: exclude_c_id,
    },
  });
  return response.data;
}

async function deleteContentAuthorUserRel(c_id) {
  const response = await axios.delete(
    `${apiURL}/content-author-user-rel/c_id/${c_id}`
  );
  return response.data;
}

async function deleteContentDocumentRel(c_id) {
  const response = await axios.delete(
    `${apiURL}/content-document-rel/c_id/${c_id}`
  );
  return response.data;
}

async function deleteContentIndustryRel(c_id) {
  const response = await axios.delete(
    `${apiURL}/content-industry-rel/c_id/${c_id}`
  );
  return response.data;
}

async function deleteContentRelatedRel(c_id) {
  const response = await axios.delete(
    `${apiURL}/content-related-rel/c_id/${c_id}`
  );
  return response.data;
}

async function deleteContentVideoRel(c_id) {
  const response = await axios.delete(
    `${apiURL}/content-video-rel/c_id/${c_id}`
  );
  return response.data;
}

module.exports = {
  findByCanonicalTitle,
  deleteContentAuthorUserRel,
  deleteContentDocumentRel,
  deleteContentIndustryRel,
  deleteContentRelatedRel,
  deleteContentVideoRel,
};
