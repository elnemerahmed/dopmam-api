const authorizedAND = (user, roles) => {
    let result = true;
    roles.forEach((role) => result &= user.roles.find((r) => role === r) !== undefined);
    return result;
};

const authorizedOR = (user, roles) => {
    let result = false;
    roles.forEach((role) => result |= user.roles.find((r) => role === r) !== undefined);
    return result;
};


module.exports = {
    authorizedAND,
    authorizedOR
};