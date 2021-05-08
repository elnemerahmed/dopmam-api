const express = require( 'express' );
const jwt = require( 'jsonwebtoken' );

const authentication = require( '../middleware/authentication' );
const { loadTokens, saveTokens } = require( '../jwt/helper' );
const { buildConnectionProfile } = require( '../fabric/ccp' );
const { buildCAClient } = require( '../fabric/ca' );
const { buildWallet } = require( '../fabric/wallet' );

const router = new express.Router();

const generateToken = ( user ) => jwt.sign( user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' } );

router.post( '/user/login', ( req, res ) => {
    try {
        const { name, organization } = req.body;
        const user = {
            name,
            organization
        };

        /*
            1. validate user in the org wallet
            2. get user roles from certificate
            3. generate and save refresh token
            4. generate temp token
            5. return to the user
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
        const { ettoken: refreshToken } = req.body;
        let tokens = loadTokens();
        if ( !tokens.includes( refreshToken ) ) {
            return res.status( 400 ).send();
        }
        jwt.verify( refreshToken, process.env.REFRESH_TOKEN_SECRET, ( error, user ) => {
            if ( error ) {
                return res.status( 400 ).send();
            }

            delete user.iat;
            const token = generateToken( user );
            res.status( 201 ).send( { token } );
        } );
    } catch ( error ) {
        res.status( 400 ).send();
    }
} );

router.post( '/user/register', async ( req, res ) => {
    try {
        const { name, organization } = req.user;
        const connectionProfile = buildConnectionProfile( organization );
        const caClient = buildCAClient( FabricCAServices, connectionProfile, organization );
        const wallet = await buildWallet( Wallets, organization );

        await enrollAdmin( caClient, wallet, organization, 'admin', 'adminpw' );
        await registerAndEnrollUser( caClient, wallet, organization, name, 'admin', );

        res.status( 200 ).send();
    } catch ( error ) {
        res.status( 400 ).send();
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