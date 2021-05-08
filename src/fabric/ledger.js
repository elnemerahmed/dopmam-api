const { Gateway, Wallets } = require( 'fabric-network' );
const FabricCAServices = require( 'fabric-ca-client' );
const { getChannels } = require( '../fabric/channel' );
const { buildConnectionProfile } = require( './ccp' );
const { buildCAClient } = require( './ca' );
const { buildWallet } = require( './wallet' );

module.exports.query = async ( name, organization, queryObject ) => {
    let result = {};
    const channels = getChannels( organization );
    const connectionProfile = buildConnectionProfile( organization );
    const caClient = buildCAClient( FabricCAServices, connectionProfile, organization );
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
    channels.forEach( async ( channel ) => {
        const network = await gateway.getNetwork( channel );
        const contract = network.getContract( process.env.CHAINCODE );
        result[ channel ] = [];

        // Push to the result array
    } );
};

module.exports.submit = async ( name, organization ) => {
    // Add Patient | Add Report | Sign Report
};