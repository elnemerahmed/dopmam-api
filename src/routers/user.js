const express = require( 'express' );
const jwt = require( 'jsonwebtoken' );

const { registerUser, userExists, getUserDetails } = require('../fabric/ca');

const router = new express.Router();

router.post( '/user/register', async ( req, res ) => {
    try {
        const { name, organization, department, roles } = req.body;
        const result = await registerUser(name, organization, department, roles.join(","));
        res.status( result.code ).send(result.error);
    } catch ( error ) {
        res.status( 400 ).send( );
    }
} );

router.post( '/user/login', async ( req, res ) => {
    try {
        const { name, password, organization } = req.body;
        let userFound = await userExists(name, organization);
        if(!userFound || password.endsWith(name[0])) {
            return res.status(404).send();
        }
        const userDetails = await getUserDetails(name, organization);
        if(userDetails.code !== 200) {
            throw new Error();
        }
        const { roles, department } = userDetails.payload;
        const userObject = { name, organization, roles, department };
        const token = jwt.sign( userObject, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' } );
        res.status( 201 ).send( { token } );
    } catch ( error ) {
        res.status( 400 ).send();
    }
} );

module.exports = router;