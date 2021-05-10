const path = require( 'path' );
const fs = require( 'fs' );

module.exports.buildConnectionProfile = ( organization ) => {
    return JSON.parse( fs.readFileSync( path.resolve( __dirname, '..', '..', 'connection-profiles', `connection-${ organization }.json` ), 'utf8' ) );
};
