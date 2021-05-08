exports.enrollAdmin = async ( caClient, wallet, organization, admin, password ) => {
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

exports.registerAndEnrollUser = async ( caClient, wallet, organization, user, admin, password ) => {
    try {
        const userIdentity = await wallet.get( user );
        if ( userIdentity ) {
            return console.log( chalk.red( `An identity for ${ userId } already exists in the wallet` ) );
        }

        const adminIdentity = await wallet.get( admin );
        if ( !adminIdentity ) {
            return console.log( chalk.red( 'Enroll the admin user before retrying' ) );
        }

        const provider = wallet.getProviderRegistry().getProvider( adminIdentity.type );
        const adminUser = await provider.getUserContext( adminIdentity, admin );
        const MSP = `${ organization.charAt( 0 ).toUpperCase() }${ organization.slice( 1 ) }MSP`;

        const secret = await caClient.register( {
            enrollmentID: user,
            role: 'client'
        }, adminUser );

        const enrollment = await caClient.enroll( {
            enrollmentID: user,
            enrollmentSecret: secret,
        } );

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: MSP,
            type: 'X.509'
        };
        await wallet.put( userLabel, x509Identity );
        console.log( chalk.green( `Successfully registered and enrolled ${ userLabel } and imported it into the wallet` ) );
    } catch ( error ) {
        console.log( chalk.red( `Failed to register user` ) );
    }
};

exports.buildCAClient = ( FabricCAServices, connectionProfile, organization ) => {
    const caInfo = connectionProfile.certificateAuthorities[ `ca.${ organization }.moh.ps` ];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const caClient = new FabricCAServices( caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName );
    console.log( chalk.green( `Built a CA Client named ${ caInfo.caName }` ) );
    return caClient;
};
