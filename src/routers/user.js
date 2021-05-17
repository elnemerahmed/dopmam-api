const express = require( 'express' );
const jwt = require( 'jsonwebtoken' );

const authentication = require('../middleware/authentication');
const { registerUser, userExists, getUserDetails, addNewAffiliation } = require('../fabric/ca');

const router = new express.Router();

router.post( '/user/register', async ( req, res ) => {
    try {
        const { name, organization, department, roles } = req.body;
        await registerUser(name, organization, department, roles.join(","));
        res.status( 200 ).send();
    } catch ( error ) {
        res.status( 400 ).send( error );
    }
} );

router.post( '/user/login', async ( req, res ) => {
    try {
        const { name, organization } = req.body;
        let userFound = await userExists(name, organization);
        if(!userFound) {
            return res.status(404).send();
        }
        const { roles, department } = await getUserDetails(name, organization);
        const userObject = { name, organization, roles, department };
        const token = jwt.sign( userObject, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' } );
        res.status( 201 ).send( { token } );
    } catch ( error ) {
        res.status( 400 ).send();
    }
} );

router.put( '/affiliations', authentication, async ( req, res ) => {
    try {
        const { roles } = req.user;
        if(!hasRole('ca-affiliations', roles)) {
            res.status( 401 ).send();
        }
        const { organization, affiliation } = req.body;
        await addNewAffiliation(organization, affiliation);
        res.status( 200 ).send();
    } catch ( error ) {
        res.status( 400 ).send();
    }
} );

module.exports = router;