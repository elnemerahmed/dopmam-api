const express = require( 'express' );

const authentication = require( '../middleware/authentication' );
const { staff } = require( '../middleware/authorization' );
const { query } = require( './../fabric/ledger' );

const router = new express.Router();

router.get( '/:hospital/reports', authentication, async ( req, res ) => {
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

router.get( '/:hospital/reports/:id', authentication, async ( req, res ) => {
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

router.post( '/:hospital/sign/:id', authentication, staff, async ( req, res ) => {

} );

router.post( '/:hospital/patients/:id', authentication, staff, async ( req, res ) => {
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

module.exports = router;