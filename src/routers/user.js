const express = require( 'express' );
const jwt = require( 'jsonwebtoken' );

const authentication = require( '../middleware/authentication' );
const { loadTokens, saveTokens } = require( '../jwt/helper' );
const { register, userExists } = require('../fabric/ca');

const router = new express.Router();

const generateToken = ( user ) => jwt.sign( user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' } );

router.post( '/user/login', async ( req, res ) => {
    try {
        const { name, organization } = req.body;
        const user = {
            name,
            organization
        };

        const userResult = await userExists(name, organization);
        if(!userResult) {
            return res.status(400).send();
        }

        /*
            2. get user roles from certificate
            [Working] 3. generate and save refresh token
            [Working] 4. generate temp token
            [Working] 5. return to the user
        */

        const refreshToken = jwt.sign( user, process.env.REFRESH_TOKEN_SECRET );
        let refreshTokens = loadTokens();
        refreshTokens.push( refreshToken );
        saveTokens( refreshTokens );

        var token = generateToken( user );

        res.status( 201 ).send( { refreshToken, token } );
    } catch ( error ) {
        res.status( 400 ).send();
    }
} );

router.post( '/user/refresh', ( req, res ) => {
    try {
        const { token: refreshToken } = req.body;
        let tokens = loadTokens();
        if ( !tokens.includes( refreshToken ) ) {
            return res.status( 400 ).send();
        }
        jwt.verify( refreshToken, process.env.REFRESH_TOKEN_SECRET, ( error, user ) => {
            if ( error ) {
                return res.status( 400 ).send();
            }

            delete user.iat;
            delete user.exp;
            const token = generateToken( user );
            res.status( 201 ).send( { token } );
        } );
    } catch ( error ) {
        res.status( 400 ).send();
    }
} );

router.post( '/user/register', async ( req, res ) => {
    try {
        const { name, organization } = req.body;
        await register(name, organization);

        res.status( 200 ).send();
    } catch ( error ) {
        res.status( 400 ).send( error );
    }
} );

router.get( '/user/logout', ( req, res ) => {
    try {
        const { token } = req.body;
        let tokens = loadTokens();
        tokens = tokens.filter( ( refreshToken ) => {
            return token !== refreshToken;
        } );
        saveTokens( tokens );
        res.status( 200 ).send();
    } catch ( error ) {
        res.status( 400 ).send();
    }
} );

router.get( '/test', authentication, ( req, res ) => {
    res.status( 200 ).send( req.user );
} );

module.exports = router;