const { Gateway, Wallets } = require( 'fabric-network' );
const { buildConnectionProfile } = require( '../fabric/ccp' );
const { buildWallet } = require( '../fabric/wallet' );
const { getChannels } = require('./channel');

/*
    TODO:
        1. Submit Patient Info
        2. Submit Report
        3. Sign Report
*/

const connectionOptions = (name) => {
    return {
        identity: name,
        wallet: wallet,
        gatewayDiscovery: {
            enabled: true,
            asLocalhost: true
        }
    };
};
 
const instantiateConnection = async (organization) => {
    const channels = getChannels( organization );
    const connectionProfile = buildConnectionProfile( organization );
    const wallet = await buildWallet( Wallets, organization );
    const gateway = new Gateway();
    return {
        channels,
        connectionProfile,
        wallet,
        gateway
    };
};

/*
    This is private method
    Use it only when creating reports
*/
const nextRecordId = async (name, organization) => {
    try {
        const { connectionProfile, gateway } = await instantiateConnection(organization);
        const options = connectionOptions(name);
        await gateway.connect( connectionProfile, options );
        const buffer = await contract.evaluateTransaction('getNextReportId');
        return parseFloat(buffer.toString());
    } catch (error) {
        return undefined;
    }
};

module.exports.getReportsInDepartment = async (name, organization, department) => {
    try {
        const { connectionProfile, gateway } = await instantiateConnection(organization);
        const options = connectionOptions(name);
        await gateway.connect( connectionProfile, options );
        const buffer = await contract.evaluateTransaction('getReportsInDepartment', department);
        return buffer.toString();
    } catch (error) {
        return undefined;
    }
};

module.exports.getReportsInHospital = async (name, organization) => {
    try {
        const { connectionProfile, gateway } = await instantiateConnection(organization);
        const options = connectionOptions(name);
        await gateway.connect( connectionProfile, options );
        const buffer = await contract.evaluateTransaction('getReportsInHospital');
        return buffer.toString();
    } catch (error) {
        return undefined;
    }
};

module.exports.getPatientDetails = async (name, organization, patientId) => {
    try {
        const { connectionProfile, gateway } = await instantiateConnection(organization);
        const options = connectionOptions(name);
        await gateway.connect( connectionProfile, options );
        const buffer = await contract.evaluateTransaction('getPatientDetails', patientId);
        return buffer.toString();
    } catch (error) {
        return undefined;
    }
};