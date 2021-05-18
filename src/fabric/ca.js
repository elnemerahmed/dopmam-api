const { buildConnectionProfile } = require( '../fabric/ccp' );
const { buildWallet } = require( '../fabric/wallet' );
const FabricCAServices = require( 'fabric-ca-client' );
const { Wallets } = require( 'fabric-network' );
const { Certificate } = require('@fidm/x509')

const enrollAdmin = async ( caClient, wallet, organization, admin, password ) => {
    try {
        const MSP = `${ organization.charAt( 0 ).toUpperCase() }${ organization.slice( 1 ) }MSP`;
        const identity = await wallet.get( admin );
        if ( identity ) {
            return { error: `admin@${organization}.moh.ps already exists.`, code: 409 };
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
        return { error: null, code: 200 };             
    } catch (error) {
        return { error, code: 400 };
    }
};

const registerAndEnrollUser = async ( caClient, wallet, organization, user, department, roles, admin ) => {
    try {
        const userIdentity = await wallet.get( user );
        if ( userIdentity ) {
            return { error: `${user}@${organization}.moh.ps already exists.`, code: 409 };
        }
        const adminIdentity = await wallet.get( admin );
        if ( !adminIdentity ) {
            return { error: `admin@${organization}.moh.ps doesn't exist.`, code: 404 };
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
        return { code: 200 };             
    } catch (error) {
        return { error, code: 400 };
    }
};

const buildCAClient = ( FabricCAServices, connectionProfile, organization ) => {
    const caInfo = connectionProfile.certificateAuthorities[ `ca.${ organization }.moh.ps` ];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const caClient = new FabricCAServices( caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName );
    return caClient;
};

const registerUser = async (name, organization, department, roles) => {
    const connectionProfile = buildConnectionProfile( organization );
    const caClient = buildCAClient( FabricCAServices, connectionProfile, organization );
    const wallet = await buildWallet( Wallets, organization );
    let result = await enrollAdmin( caClient, wallet, organization, 'admin', 'adminpw' );
    if(result.code != 200 && result.code != 409) {
        return result;
    }
    result = await registerAndEnrollUser( caClient, wallet, organization, name, department, roles, 'admin' );
    if(result.code != 200) {
        return result;
    }
    return { code: 200 };             
};

const userExists = async (name, organization) => {
    const wallet = await buildWallet( Wallets, organization );
    return await wallet.get( name ) !== undefined;
};

const getUserDetails = async (name, organization) => {
    const wallet = await buildWallet( Wallets, organization );
    if(!userExists(name, organization)) {
        return { code: 404 };             
    }

    try {
        const user = await wallet.get( name );
        const { certificate } = user.credentials;
        const certificateObject = Certificate.fromPEM(certificate);
        const rolesJSON = JSON.parse(certificateObject.extensions[certificateObject.extensions.length - 1].value.toString()).attrs.roles;
        const department = certificateObject.subject.attributes[2].value;

        return { 
            code: 200, 
            payload: 
                { 
                    roles: rolesJSON.slice(1, -1).split(','),
                    department 
                }  
            };
    } catch (error) {
        return { error, code: 400 };
    }
};

module.exports = {
    buildCAClient,
    registerUser,
    userExists,
    getUserDetails
};