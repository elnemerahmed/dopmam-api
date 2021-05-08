const path = require( 'path' );
const fs = require( 'fs' );

module.exports.buildConnectionProfile = ( organization ) => {
    const connectionProfile = JSON.parse( fs.readFileSync( path.resolve( __dirname, 'connection-profiles', `connection-${ organization }.json` ), 'utf8' ) );
    return console.log( chalk.green( `Loaded ${ organization } configuration located at ${ connectionProfilePath }` ) );
};
