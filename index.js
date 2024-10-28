//Establish express server and routes.
const express = require("express");
const compression = require("compression");
const mountRoutes = require("./routes");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const cronJobs = require("./cron");
require("dotenv-flow").config({ silent: true });

//Set apiURL globally.
apiURL = process.env.API_URL;

//Compress all responses
app.use(compression());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "*");
  //Set global IP address from request.
  ipAddress =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
  next();
});

mountRoutes(app);

try {
  // Default URL for website
  app.use("/public", express.static(__dirname + "/public"));

  app.use("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"));
  });

  //Display connection port and env.
  const port = process.env.PORT;
  const node_env = process.env.NODE_ENV;

  //Set log and email services for errors.
  logService = require("./services/utils/LogService");
  emailService = require("./services/utils/email/NodeMailerService");

  cronJobs.initScheduledJobs();

  app.listen(port, function () {
    console.log("Listening on port " + port + " for " + node_env);
  });
} catch (e) {
  app.get("/", function (req, res) {
    res.send("An error occurred when starting the app.<hr/>" + e);
  });
}
