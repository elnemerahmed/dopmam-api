const express = require( 'express' );

const authentication = require( '../middleware/authentication' );
const { createPatient, getPatient, deletePatient, createReport, signReport, rejectReport, getReport, getReports } = require( './../fabric/ledger' );
const { authorizedAND, authorizedOR } = require('../utils');

const router = new express.Router();

router.post( '/patients/getPatient', authentication, async ( req, res ) => {
    try {
        const { id } = req.body;
        const { user } = req;
        const { name, organization } = user;
        
        if(!authorizedOR(user, ['doctor', 'head_department', 'hospital_manager'])) {
            res.status( 401 ).send();
        }

        const result = await getPatient(name, organization, id);

        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 404 ).send();
    }
} );

router.post( '/patients/addPatient', authentication, async ( req, res ) => {
    try {
        const { user } = req;
        const { name, organization } = user;
        const { nationalId, firstName, lastName, gender, dateOfBirth, insuranceNumber, insuranceDueDate } = req.body;
 
        if(!authorizedAND(user, ["doctor"])) {
            res.status( 401 ).send();
        }

        const result = await createPatient(name, organization, nationalId, firstName, lastName, gender, dateOfBirth, insuranceNumber, insuranceDueDate);

        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 500 ).send();
    }
} );

router.post( '/patients/deletePatient', authentication, async ( req, res ) => {
    try {
        const { user } = req;
        const { name, organization } = user;
        const { id } = req.body;
 
        if(!authorizedAND(user, ["doctor"])) {
            res.status( 401 ).send();
        }

        const result = await deletePatient(name, organization, id);

        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 404 ).send();
    }
} );

router.post( '/report/new', authentication, async ( req, res ) => {
    try {
        const { user } = req;
        const { name, organization } = user;
        const { patientNationalId, reportDate, medicalHistoryAndClinicalFindings, diagnosis, recommendation } = req.body;
 
        if(!authorizedAND(user, ["doctor"])) {
            res.status( 401 ).send();
        }

        const result = await createReport(name, organization, patientNationalId, reportDate, medicalHistoryAndClinicalFindings, diagnosis, recommendation);

        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 500 ).send();
    }
} );

router.post( '/report/sign', authentication, async ( req, res ) => {
    try {
        const { user } = req;
        const { name, organization } = user;
        const { id } = req.body;
 
        if(!authorizedOR(user, ["doctor", "head_department", "hospital_manager"])) {
            res.status( 401 ).send();
        }

        const result = await signReport(name, organization, id, "", "", "", "", 0, 0);

        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 500 ).send();
    }
} );

router.post( '/report/reject', authentication, async ( req, res ) => {
    try {
        const { user } = req;
        const { name, organization } = user;
        const { id } = req.body;
 
        if(!authorizedOR(user, ["doctor", "head_department", "hospital_manager"])) {
            res.status( 401 ).send();
        }

        const result = await rejectReport(name, organization, id);

        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 500 ).send();
    }
} );

router.post( '/report', authentication, async ( req, res ) => {
    try {
        const { user } = req;
        const { name, organization } = user;
        const { id } = req.body;
 
        if(!authorizedOR(user, ["doctor", "head_department", "hospital_manager"])) {
            res.status( 401 ).send();
        }

        const result = await getReport(name, organization, id);
        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 404 ).send();
    }
} );

router.post( '/reports', authentication, async ( req, res ) => {
    try {
        const { user } = req;
        const { name, organization } = user;
 
        if(!authorizedOR(user, ["doctor", "head_department", "hospital_manager"])) {
            res.status( 401 ).send();
        }

        const result = await getReports(name, organization);
        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 404 ).send();
    }
} );

module.exports = router;
