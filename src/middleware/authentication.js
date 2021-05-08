const jwt = require( 'jsonwebtoken' )

const authentication = ( req, res, next ) => {
    try {
        const token = req.header( 'Authorization' ).replace( 'Bearer ', '' );
        req.user = jwt.verify( token, process.env.ACCESS_TOKEN_SECRET );
        next();
    } catch ( error ) {
        res.status( 401 ).send();
    }
};

module.exports = authentication;