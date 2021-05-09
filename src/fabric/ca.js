const chalk = require( 'chalk' );
const { buildConnectionProfile } = require( '../fabric/ccp' );
const { buildWallet } = require( '../fabric/wallet' );
const FabricCAServices = require( 'fabric-ca-client' );
const { Wallets } = require( 'fabric-network' );

const enrollAdmin = async ( caClient, wallet, organization, admin, password ) => {
    try {
        const MSP = `${ organization.charAt( 0 ).toUpperCase() }${ organization.slice( 1 ) }MSP`;
        const identity = await wallet.get( admin );
        if ( identity ) {
            return console.log( chalk.red( `An identity for the ${ admin } already exists in the wallet` ) );
        }

        const enrollment = await caClient.enroll( { enrollmentID: admin, enrollmentSecret: password } );
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: MSP,
            type: 'X.509',
        };
        await wallet.put( admin, x509Identity );
        console.log( chalk.green( `Successfully enrolled ${ admin } imported it into the wallet` ) );
    } catch ( error ) {
        console.log( chalk.red( `Failed to enroll ${ admin }` ) );
    }
};

const registerAndEnrollUser = async ( caClient, wallet, organization, user, department, roles, admin ) => {
    try {
        const userIdentity = await wallet.get( user );
        if ( userIdentity ) {
            return console.log( chalk.red( `An identity for ${ user } already exists in the wallet` ) );
        }

        const adminIdentity = await wallet.get( admin );
        if ( !adminIdentity ) {
            return console.log( chalk.red( 'Enroll the admin user before retrying' ) );
        }

        const provider = wallet.getProviderRegistry().getProvider( adminIdentity.type );
        const adminUser = await provider.getUserContext( adminIdentity, admin );
        const MSP = `${ organization.charAt( 0 ).toUpperCase() }${ organization.slice( 1 ) }MSP`;

        const secret = await caClient.register( {
            affiliation: `${organization}.${department}`,
            enrollmentID: user,
            role: 'client',
            attrs: [
                { 
                    name: "roles", 
                    value: JSON.stringify(roles), 
                    ecert: true
                }
            ]
        }, adminUser );

        const enrollment = await caClient.enroll( {
            enrollmentID: user,
            enrollmentSecret: secret,
            attr_reqs: [{ name: "roles", optional: false }]
        } );

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: MSP,
            type: 'X.509'
        };
        await wallet.put( user, x509Identity );
        console.log( chalk.green( `Successfully registered and enrolled ${ user } and imported it into the wallet` ) );
    } catch ( error ) {
        console.log( chalk.red( `Failed to register user` ) );
    }
};

const buildCAClient = ( FabricCAServices, connectionProfile, organization ) => {
    const caInfo = connectionProfile.certificateAuthorities[ `ca.${ organization }.moh.ps` ];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const caClient = new FabricCAServices( caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName );
    console.log( chalk.green( `Built a CA Client named ${ caInfo.caName }` ) );
    return caClient;
};

module.exports.buildCAClient = buildCAClient;

module.exports.register = async (name, organization, department, roles) => {
    const connectionProfile = buildConnectionProfile( organization );
    const caClient = buildCAClient( FabricCAServices, connectionProfile, organization );
    const wallet = await buildWallet( Wallets, organization );

    await enrollAdmin( caClient, wallet, organization, 'admin', 'adminpw' );
    await registerAndEnrollUser( caClient, wallet, organization, name, department, roles, 'admin' );
};

module.exports.userExists = async (name, organization) => {
    const connectionProfile = buildConnectionProfile( organization );
    const caClient = buildCAClient( FabricCAServices, connectionProfile, organization );
    const wallet = await buildWallet( Wallets, organization );

    const user = await wallet.get( name );
    return user; 
};