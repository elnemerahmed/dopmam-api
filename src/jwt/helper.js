const { response } = require( 'express' );
const fs = require( 'fs' );
const path = require( 'path' );

const tokensPath = path.join( 'tokens.json' );

module.exports.loadTokens = () => {
    try {
        let buffer = fs.readFileSync( tokensPath );
        return JSON.parse( buffer );
    } catch ( error ) {
        return [];
    }
};

module.exports.saveTokens = ( tokens ) => {
    const tokensJSON = JSON.stringify( tokens );
    fs.writeFileSync( tokensPath, tokensJSON );
};