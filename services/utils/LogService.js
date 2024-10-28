const axios = require("axios");

async function findByName(log_name) {
  const response = await axios.get(`${apiURL}/log`, {
    params: { log_name: log_name },
  });
  return response.data;
}

async function addLog(obj) {
  //Set obj defaults.
  obj.log_name ??= "No log name";
  obj.log_description ??= "No log description";
  obj.log_ip ??= ipAddress;
  obj.logt_id ??= 0;
  obj.user_id ??= 1;

  try {
    const response = await axios.post(`${apiURL}/log`, {
      log_name: obj.log_name,
      log_description: obj.log_description,
      log_ip: obj.log_ip,
      logt_id: obj.logt_id,
      user_id: obj.user_id,
    });
  } catch ({ response, error }) {
    console.error("An error occured in LogService for addLog" + error);
  }
}

module.exports = {
  findByName,
  addLog,
};
