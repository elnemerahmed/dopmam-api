const express = require( 'express' );

const authentication = require( '../middleware/authentication' );
const { query } = require( '../fabric/ledger' );

const router = new express.Router();

router.get( '/dopmam/reports', authentication, async ( req, res ) => {
    try {
        const { hospital } = req.params;
        const { name, organization } = req.user;
        const queryObject = '###';
        const result = query( name, organization, queryObject );
        res.status( 200 ).send( result );
    } catch ( error ) {
        res.status( 404 ).send();
    }
} );

router.get( '/dopmam/reports/:id', authentication, ( req, res ) => {
    try {
        const { hospital, id } = req.params;
        const { name, organization } = req.user;
        const queryObject = '###';
        const result = query( name, organization, queryObject );
        res.status( 200 ).send( result );
    } catch ( error ) {
        res.status( 404 ).send();
    }
} );

router.post( '/dopmam/sign/:id', authentication, ( req, res ) => {

} );

module.exports = router;