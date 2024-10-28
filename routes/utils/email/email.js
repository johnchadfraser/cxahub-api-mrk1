//Set router object.
const Router = require("express-promise-router");
const router = new Router();

//Set auth.
const auth = require("../../../middleware/auth");
const { service } = require("../../../middleware/roles");

// Export our router to be mounted by the parent application
module.exports = router;

//Set services used by route.
const NodeMailerService = require("../../../services/utils/email/NodeMailerService");

router.post("/", [auth, service], async (req, res, next) => {
  NodeMailerService.smtpHandler(req.body);

  next();
});
