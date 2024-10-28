// Hash encrypted password generator.
const Router = require('express-promise-router');
const bcrypt = require("bcryptjs");

const router = new Router();

module.exports = router;

//Get the encrypted password.
router.get('/:password', async (req, res) => {

    // Hash the password.
	const { password } = req.params;
	const salt  = await bcrypt.genSalt(15);
	res.send(await bcrypt.hash(password, salt));

});