const express = require( 'express' );

const authentication = require( '../middleware/authentication' );

const router = new express.Router();

router.post( '/dopmam/report/sign', authentication, async ( req, res ) => {
    try {
        const { user } = req;
        const { name, organization } = user;
        const { reportId } = req.body;
 
        if(!authorizedOR(user, ["dopmam_medical_lead", "dopmam_medical", "dopmam_financial_lead", "dopmam_financial"])) {
            throw new Error();
        }

        const result = await signReport(name, organization, reportId);

        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 500 ).send(error);
    }
} );

router.get( '/dopmam/reports', authentication, async ( req, res ) => {
    try {
        const { user } = req;
        const { name, organization } = user;
        const { reportId } = req.body;
 
        if(!authorizedOR(user, ["dopmam_medical_lead", "dopmam_medical", "dopmam_financial_lead", "dopmam_financial"])) {
            throw new Error();
        }

        const result = await getRports(name, organization);
        res.status( 200 ).send(result);
    } catch ( error ) {
        res.status( 500 ).send(error);
    }
} );

module.exports = router;


