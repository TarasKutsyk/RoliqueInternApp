const { rolesMatcher } = require('../../helper');
const {
    ErrorHandler,
    errorCodes,
    errorMessages
} = require('../../error');
const { ROLES } = require('../../constants/magic-string.enum');

module.exports = (req, res, next) => {
    try {
        const {
            user: { role: clientRole },
            body: { role: roleToCreate = ROLES.EMPLOYEE },
        } = req;

        console.log(req.user);

        const isClientAllowed = rolesMatcher(clientRole, roleToCreate);

        console.log(isClientAllowed);
        if (!isClientAllowed) {
            throw new ErrorHandler(errorCodes.FORBIDDEN,
                errorMessages.UNAUTHORIZED_ROLE.customCode, errorMessages.UNAUTHORIZED_ROLE.message);
        }

        console.log(req.user);
        next();
    } catch (e) {
        next(e);
    }
};
