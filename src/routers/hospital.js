const express = require( 'express' );

const authentication = require( '../middleware/authentication' );
const { createPatient } = require( './../fabric/ledger' );
const { authorizedAND, authorizedOR } = require('../utils');

const router = new express.Router();

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

router.post( '/patients', authentication, async ( req, res ) => {
    try {
        const { user } = req;
        const { name, organization } = user;
        const { nationalId, firstName, lastName, gender, dateOfBirth, insuranceNumber, insuranceDueDate } = req.body;
        if(!authorizedOR(user, ['doctor', 'head_department', 'hospital_manager'])) {
            res.status( 401 ).send();
        }
        const result = await createPatient(name, organization, nationalId, firstName, lastName, gender, dateOfBirth, insuranceNumber, insuranceDueDate);
        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 500 ).send(error);
    }
} );

module.exports = router;