const express = require( 'express' );

const authentication = require( '../middleware/authentication' );
const { query } = require( './../fabric/ledger' );
const { hasRole } = require('../utils');

const router = new express.Router();

router.get( '/:department/reports', authentication, async ( req, res ) => {
    try {
        const { department } = req.params;
        if(!hasRole("head_department") || req.user.department !== department) {
            throw new Error();
        }

        res.status( 200 ).send();
    } catch ( error ) {
        res.status( 404 ).send();
    }
} );

router.get( '/:hospital/reports', authentication, async ( req, res ) => {
    try {
        const { hospital } = req.params;
        if(!hasRole("hospital_manager") || req.user.organization !== hospital) {
            throw new Error();
        }

        res.status( 200 ).send();
    } catch ( error ) {
        res.status( 404 ).send();
    }
} );

router.post( '/:department/reports', authentication, async ( req, res ) => {
    try {
        const { department } = req.params;
        if(!hasRole("doctor") || req.user.department !== department) {
            throw new Error();
        }

        res.status( 200 ).send();
    } catch ( error ) {
        res.status( 404 ).send();
    }
} );

router.get( '/patients', authentication, async ( req, res ) => {
    try {
        const { id } = req.params;
        if(!hasRole("doctor")) {
            throw new Error();
        }

        res.status( 200 ).send();
    } catch ( error ) {
        res.status( 404 ).send();
    }
} );

router.post( '/:department/patients', authentication, async ( req, res ) => {
    try {
        const { department } = req.params;
        if(!hasRole("doctor") || req.user.department !== department) {
            throw new Error();
        }

        res.status( 200 ).send();
    } catch ( error ) {
        res.status( 404 ).send();
    }
} );

module.exports = router;