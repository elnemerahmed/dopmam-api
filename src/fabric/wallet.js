const path = require( 'path' );

module.exports.buildWallet = async ( Wallets, organization ) => {
    return await Wallets.newFileSystemWallet( path.resolve( __dirname, '..', '..', 'wallets', `${ organization }.moh.ps` ) );
};