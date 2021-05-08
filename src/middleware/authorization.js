module.exports.staffMember = ( req, res, next ) => {
    const { roles } = req.user;
    if ( !roles.contains( "doctor" ) && !roles.contains( "head_department" ) && !roles.contains( "hospital_manager" ) ) {
        return res.status( 400 ).send();
    }
    next();
};