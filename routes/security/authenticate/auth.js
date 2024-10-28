const Router = require('express-promise-router');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const env = require('dotenv').config();
const router = new Router();

router.post("/", async (req, res) => {

	// Service user data.
	const users = [{ email: process.env.SERVICE_USERNAME, password: process.env.SERVICE_PASSWORD, roles: ["service"] }];

	// Get user from database, if the user is not there return an error. 
	let user = users.find(u => u.email === req.body.email);
	if(!user) throw new Error("Invalid email.");

	// Compare the password with the password in the database.
	const valid = await bcrypt.compare(req.body.password, user.password);
	if(!valid) throw new Error("Invalid password.");

	const token = jwt.sign({
        id: user._id,
		roles: user.roles,
	}, "jwtPrivateKey", {expiresIn: "60m"}
	);

	res.send({
		access: true,
		token: token
	});

})

// Export our router to be mounted by the parent application
module.exports = router;