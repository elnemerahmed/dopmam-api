const { Gateway, Wallets } = require( 'fabric-network' );
const { buildConnectionProfile } = require( '../fabric/ccp' );
const { buildWallet } = require( '../fabric/wallet' );
const { getChannelsForOrganization } = require('./channel');

module.exports.createPatient = async (name, organization, nationalId, firstName, lastName, gender, dateOfBirth, insuranceNumber, insuranceDueDate) => {
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
    const buffer = await contract.submitTransaction('createPatient', nationalId, firstName, lastName, gender, dateOfBirth, insuranceNumber, insuranceDueDate);
    return buffer.toString();
};