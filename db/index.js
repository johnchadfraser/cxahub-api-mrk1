try {
  const env = require("dotenv-flow").config({ silent: true });
  const pg = require("pg");

  //Establish Connection based on env.
  if (process.env.NODE_ENV != "local") {
    //VCAP_SERVICE exposure.
    const cfenv = require("cfenv");
    const appEnv = cfenv.getAppEnv();
    const cxahubservice = "cxahub-psql-db";

    const vcapservices = JSON.stringify(appEnv.getServices());
    srv = JSON.parse(vcapservices);
    credentials = srv[cxahubservice]["credentials"];

    var hostname = credentials.hostname;
    var portno = credentials.port;
    var database = credentials.dbname;
    var username = credentials.username;
    var password = credentials.password;

    conn = new pg.Client({
      host: hostname,
      port: portno,
      database: database,
      user: username,
      password: password,
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    });
  } else {
    conn = new pg.Client({
      host: process.env.LOCAL_DB_HOSTNAME,
      port: process.env.LOCAL_DB_PORT,
      database: process.env.LOCAL_DB_DATABASE,
      user: process.env.LOCAL_DB_USERNAME,
      password: process.env.LOCAL_DB_PASSWORD,
    });
  }

  conn.connect(function (err) {
    if (err) throw err;
  });

  module.exports = {
    query: (text, params) => conn.query(text, params),
  };
} catch (e) {
  app.get("/", function (req, res) {
    res.send("An error occurred with the DB connection.<hr/>" + e);
  });
}
