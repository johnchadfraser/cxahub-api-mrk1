const Router = require('express-promise-router');
const router = new Router();
const env = require('dotenv').config();

router.post("/", async (req, res) => {

    //Get emarsys auth.
    const auth = require('../../../interface/emarsys/auth');
	
    //Generate token.
    const token = auth.getWsseHeader(process.env.EMARSYS_API_USER, process.env.EMARSYS_API_USER_SECRET);

	res.send({
		token: token
    });

})

// Export our router to be mounted by the parent application
module.exports = router;