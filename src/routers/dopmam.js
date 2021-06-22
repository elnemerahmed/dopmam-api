const express = require( 'express' );

const authentication = require( '../middleware/authentication' );
const { authorizedAND, authorizedOR } = require('../utils');
const { signReport, getReport, getReports, rejectReport, getPatient } = require( './../fabric/ledger' );


const router = new express.Router();

router.post( '/dopmam/report/sign', authentication, async ( req, res ) => {
    try {
        const { user } = req;
        const { name, organization } = user;
        const { id, country, city, hospital, dept, date, coverage, channel } = req.body;
 
        if(!authorizedOR(user, ["dopmam_medical_lead", "dopmam_medical", "dopmam_financial_lead", "dopmam_financial"])) {
            throw new Error();
        }

        const result = await signReport(name, organization, id, country, city, hospital, dept, date, coverage, channel);

        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 500 ).send();
    }
} );

router.post( '/dopmam/report/reject', authentication, async ( req, res ) => {
    try {
        const { user } = req;
        const { name, organization } = user;
        const { id, channel } = req.body;
 
        if(!authorizedOR(user, ["dopmam_medical_lead", "dopmam_medical", "dopmam_financial_lead", "dopmam_financial"])) {
            res.status( 401 ).send();
        }

        const result = await rejectReport(name, organization, id, channel);

        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 500 ).send();
    }
} );

router.post( '/dopmam/report', authentication, async ( req, res ) => {
    try {
        const { user } = req;
        const { name, organization } = user;
        const { id, channel } = req.body;
 
        if(!authorizedOR(user, ["dopmam_medical_lead", "dopmam_medical", "dopmam_financial_lead", "dopmam_financial"])) {
            res.status( 401 ).send();
        }

        const result = await getReport(name, organization, id, channel);
        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 404 ).send();
    }
} );

router.post( '/dopmam/reports', authentication, async ( req, res ) => {
    try {
        const { user } = req;
        const { name, organization } = user;
        const { channel } = req.body;

        if(!authorizedOR(user, ["dopmam_medical_lead", "dopmam_medical", "dopmam_financial_lead", "dopmam_financial"])) {
            res.status( 401 ).send();
        }

        const result = await getReports(name, organization, channel);
        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 500 ).send();
    }
} );

router.post( '/dopmam/patients/getPatient', authentication, async ( req, res ) => {
    try {
        const { id, channel } = req.body;
        const { user } = req;
        const { name, organization } = user;
        
        if(!authorizedOR(user, ["dopmam_medical_lead", "dopmam_medical", "dopmam_financial_lead", "dopmam_financial"])) {
            res.status( 401 ).send();
        }

        const result = await getPatient(name, organization, id, channel);

        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 404 ).send();
    }
} );

module.exports = router;


