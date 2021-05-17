module.exports.getChannelsForOrganization = ( organization ) => {
    if ( organization === 'dopmam' ) {
        return [ 'dopmam-shifa', 'dopmam-naser' ];
    } else if ( organization === 'shifa' ) {
        return [ 'dopmam-shifa' ];
    } else if ( organization === 'naser' ) {
        return [ 'dopmam-naser' ];
    } else {
        return [];
    }
};