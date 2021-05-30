const { Gateway, Wallets } = require( 'fabric-network' );
const { buildConnectionProfile } = require( '../fabric/ccp' );
const { buildWallet } = require( '../fabric/wallet' );
const { getChannelsForOrganization } = require('./channel');

const initializeConnectionForOrgranization = (name, organization) => {
    const channel = getChannelsForOrganization( organization )[0];
    const connectionProfile = buildConnectionProfile( organization );
    const wallet = await buildWallet( Wallets, organization );
    const gateway = new Gateway();
    const connectionOptions = {
        identity: name,
        wallet: wallet,
        gatewayDiscovery: {
            enabled: true,
            asLocalhost: true
        }
    };
    await gateway.connect( connectionProfile, connectionOptions );
    const network = await gateway.getNetwork( channel );
    const contract = network.getContract( process.env.CHAINCODE );
    return contract;
};

const createPatient = async (name, organization, nationalId, firstName, lastName, gender, dateOfBirth, insuranceNumber, insuranceDueDate) => {
    const contract = initializeConnectionForOrgranization(name, organization);
    const buffer = await contract.submitTransaction('createPatient', nationalId, firstName, lastName, gender, dateOfBirth, insuranceNumber, insuranceDueDate);
    return buffer.toString();
};

const deletePatient = async (name, organization, nationalId) => {
    const contract = initializeConnectionForOrgranization(name, organization);
    const buffer = await contract.evaluateTransaction('deletePatient', nationalId);
    return buffer.toString();
};

const getPatient = async (name, organization, nationalId) => {
    const contract = initializeConnectionForOrgranization(name, organization);
    const buffer = await contract.evaluateTransaction('getPatient', nationalId);
    return buffer.toString();
};

const createReport = async (name, organization, reportId, patientNationalId, reportDate, summary, diagnosis, procedure) => {
    const contract = initializeConnectionForOrgranization(name, organization);
    const buffer = await contract.submitTransaction('createReport', reportId, patientNationalId, reportDate, summary, diagnosis, procedure);
    return buffer.toString();
};

const signReport = async (name, organization, reportId) => {
    const contract = initializeConnectionForOrgranization(name, organization);
    const buffer = await contract.submitTransaction('signReport', reportId);
    return buffer.toString();
};

const getReport = async (name, organization, reportId) => {
    const contract = initializeConnectionForOrgranization(name, organization);
    const buffer = await contract.evaluateTransaction('getReport', reportId);
    return buffer.toString();
};

const getReports = async (name, organization) => {
    const contract = initializeConnectionForOrgranization(name, organization);
    const buffer = await contract.evaluateTransaction('getReports');
    return buffer.toString();
};

module.exports = {
    createPatient,
    getPatient,
    deletePatient,
    createReport,
    signReport,
    getReport,
    getReports
};
