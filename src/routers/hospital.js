const express = require( 'express' );

const authentication = require( '../middleware/authentication' );
const { createPatient, getPatient, deletePatient, createReport, signReport, getRports } = require( './../fabric/ledger' );
const { authorizedAND, authorizedOR } = require('../utils');

const router = new express.Router();

router.get( '/patient', authentication, async ( req, res ) => {
    try {
        const { id } = req.params;
        const { user } = req;
        const { name, organization } = user;
        
        if(!authorizedOR(user, ['doctor', 'head_department', 'hospital_manager'])) {
            throw new Error();
        }

        const result = await getPatient(name, organization, id);

        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 404 ).send();
    }
} );

router.post( '/patient', authentication, async ( req, res ) => {
    try {
        const { user } = req;
        const { name, organization } = user;
        const { nationalId, firstName, lastName, gender, dateOfBirth, insuranceNumber, insuranceDueDate } = req.body;
 
        if(!authorizedAND(user, ["doctor"])) {
            throw new Error();
        }

        const result = await createPatient(name, organization, nationalId, firstName, lastName, gender, dateOfBirth, insuranceNumber, insuranceDueDate);

        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 500 ).send(error);
    }
} );

router.delete( '/patient', authentication, async ( req, res ) => {
    try {
        const { user } = req;
        const { name, organization } = user;
        const { nationalId } = req.body;
 
        if(!authorizedAND(user, ["doctor"])) {
            throw new Error();
        }

        const result = await deletePatient(name, organization, nationalId);

        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 500 ).send(error);
    }
} );

router.post( '/report/new', authentication, async ( req, res ) => {
    try {
        const { user } = req;
        const { name, organization } = user;
        const { reportId, patientNationalId, reportDate, summary, diagnosis, procedure } = req.body;
 
        if(!authorizedAND(user, ["doctor"])) {
            throw new Error();
        }

        const result = await createReport(name, organization, reportId, patientNationalId, reportDate, summary, diagnosis, procedure);

        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 500 ).send(error);
    }
} );

router.post( '/report/sign', authentication, async ( req, res ) => {
    try {
        const { user } = req;
        const { name, organization } = user;
        const { reportId } = req.body;
 
        if(!authorizedOR(user, ["doctor", "head_department", "hospital_manager"])) {
            throw new Error();
        }

        const result = await signReport(name, organization, reportId);

        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 500 ).send(error);
    }
} );

router.get( '/reports', authentication, async ( req, res ) => {
    try {
        const { user } = req;
        const { name, organization } = user;
        const { reportId } = req.body;
 
        if(!authorizedOR(user, ["doctor", "head_department", "hospital_manager"])) {
            throw new Error();
        }

        const result = await getRports(name, organization);
        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 500 ).send(error);
    }
} );

module.exports = router;
