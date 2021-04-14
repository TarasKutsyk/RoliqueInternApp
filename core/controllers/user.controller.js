const { userService } = require('../services');
const { passwordHasher } = require('../helper');
const { successMessages } = require('../error');

module.exports = {
    getUsers: async (req, res, next) => {
        try {
            const users = await userService.getAllUsers();

            res.json(users);
        } catch (e) {
            next(e);
        }
    },
    createUser: async (req, res, next) => {
        const { body } = req;

        try {
            const hashPassword = await passwordHasher.hash(body.password);

            await userService.createUser({ ...body, password: hashPassword });

            res.json(successMessages.CREATE);
        } catch (e) {
            next(e);
        }
    },
    editUser: async (req, res, next) => {
        const { body } = req;

        try {
            const userToUpdate = await userService.getUserByEmail(body.email);

            const hashPassword = await passwordHasher.hash(body.password);

            await userService.updateUserById(userToUpdate._id, { ...body, password: hashPassword });

            res.json(successMessages.UPDATE);
        } catch (e) {
            next(e);
        }
    }
};
