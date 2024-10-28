// Token generation and authentication check.
const jwt = require("jsonwebtoken");
const axios = require('axios');
require('dotenv-flow').config({ silent: true });

//Set the environment for the API server.
const apiAuthURL = process.env.API_URL + '/auth';

//Call the token async.
async function getToken(apiAuthURL) {

    //Call the token auth API.
    const response = await axios({
        method: 'post',
        url: apiAuthURL,
        data: {
            email: process.env.SERVICE_USERNAME,
            password: process.env.SERVICE_PASSWORD_STATIC
        }
    })

    //Store the token for reuse.
    process.env['API_TOKEN'] = response.data.token;

}

module.exports = (req, res, next) => {

    let token = '';

    if(process.env.API_TOKEN == 'NULL') {

        getToken(apiAuthURL).then(function() {

            token = process.env.API_TOKEN;

            const decoded = jwt.verify(token, "jwtPrivateKey");
            req.user = decoded;

        next();

        }); 

    } else {

        token = process.env.API_TOKEN;

        //Verify the token.
        try {
            
            const decoded = jwt.verify(token, "jwtPrivateKey");
            req.user = decoded;

        } catch (error) {

            //If the token caused an error becuase it was expired re-run the request.
            if(error instanceof jwt.TokenExpiredError) {

                console.log('Token expired');

                //Reset the token.
                process.env['API_TOKEN'] ='NULL';

                getToken(apiAuthURL);

            }
    
        }

        next();

    }

}