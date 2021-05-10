const { buildConnectionProfile } = require( '../fabric/ccp' );
const { buildWallet } = require( '../fabric/wallet' );
const FabricCAServices = require( 'fabric-ca-client' );
const { Wallets } = require( 'fabric-network' );
const { Certificate } = require('@fidm/x509')

const enrollAdmin = async ( caClient, wallet, organization, admin, password ) => {
    const MSP = `${ organization.charAt( 0 ).toUpperCase() }${ organization.slice( 1 ) }MSP`;
    const identity = await wallet.get( admin );
    if ( identity ) {
        throw new Error("Admin Exists");
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
};

const registerAndEnrollUser = async ( caClient, wallet, organization, user, department, roles, admin ) => {
    const userIdentity = await wallet.get( user );
    if ( userIdentity ) {
        throw new Error("User Exists");
    }

    const adminIdentity = await wallet.get( admin );
    if ( !adminIdentity ) {
        throw new Error("No Admin");
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
    try {
        await enrollAdmin( caClient, wallet, organization, 'admin', 'adminpw' );    
    } catch (error) {
        
    }
    try {
        await registerAndEnrollUser( caClient, wallet, organization, name, department, roles, 'admin' );
    } catch (error) {
        throw new Error(error);
    }   
};

module.exports.userExists = async (name, organization) => {
    const wallet = await buildWallet( Wallets, organization );
    const user = await wallet.get( name );
    return user; 
};

module.exports.userRoles = async (name, organization) => {
    const wallet = await buildWallet( Wallets, organization );
    const user = await wallet.get( name );
    const { certificate } = user.credentials;
    const certificateObject = Certificate.fromPEM(certificate);
    const rolesJSON = JSON.parse(certificateObject.extensions[certificateObject.extensions.length - 1].value.toString()).attrs.roles;
    return rolesJSON.split(",");
};