const express = require( 'express' );

const authentication = require( '../middleware/authentication' );
const { authorizedAND, authorizedOR } = require('../utils');
const { signReport, getReport } = require( './../fabric/ledger' );


const router = new express.Router();

router.post( '/dopmam/report/sign', authentication, async ( req, res ) => {
    try {
        const { user } = req;
        const { name, organization } = user;
        const { id, country, city, hospital, dept, date, coverage } = req.body;
 
        if(!authorizedOR(user, ["dopmam_medical_lead", "dopmam_medical", "dopmam_financial_lead", "dopmam_financial"])) {
            throw new Error();
        }

        const result = await signReport(name, organization, id, country, city, hospital, dept, date, coverage);

        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 401 ).send();
    }
} );

router.get( '/dopmam/report', authentication, async ( req, res ) => {
    try {
        const { user } = req;
        const { name, organization } = user;
        const { id } = req.body;
 
        if(!authorizedOR(user, ["dopmam_medical_lead", "dopmam_medical", "dopmam_financial_lead", "dopmam_financial"])) {
            throw new Error();
        }

        const result = await getReport(name, organization, id);
        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 401 ).send();
    }
} );

module.exports = router;


