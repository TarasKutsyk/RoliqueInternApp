const { influencerService, fileUploadService } = require('../services');
const {
    ErrorHandler,
    errorCodes,
    errorMessages: { INFLUENCER_NOT_FOUND },
    successMessages
} = require('../error');

module.exports = {
    getAllInfluencers: async (req, res, next) => {
        try {
            const influencers = await influencerService.getAllInfluencers(req.query);

            res.json(influencers);
        } catch (e) {
            next(e);
        }
    },
    getInfluencerById: async (req, res, next) => {
        try {
            const { id } = req.params;

            const isInfluencerExist = await influencerService.doesInfluencerExist({ _id: id });

            if (!isInfluencerExist) {
                throw new ErrorHandler(errorCodes.BAD_REQUEST, INFLUENCER_NOT_FOUND.customCode, INFLUENCER_NOT_FOUND.message);
            }

            const influencer = await influencerService.getInfluencerById(id);
            res.json(influencer);
        } catch (e) {
            next(e);
        }
    },
    createInfluencer: async (req, res, next) => {
        const { body, avatar } = req;

        try {
            const newInfluencer = await influencerService.createInfluencer(body);

            if (avatar) {
                const avatarUploadPath = await fileUploadService.uploadFile(
                    avatar,
                    'influencer',
                    newInfluencer._id,
                    'photo'
                );
                await influencerService.updateInfluencerById(newInfluencer._id, { profile_picture: avatarUploadPath });
            }

            res.send(successMessages.CREATE);
        } catch (e) {
            next(e);
        }
    },
    updateInfluencer: async (req, res, next) => {
        try {
            const {
                body,
                id
            } = req;

            await influencerService.updateInfluencerById(id, body);

            const newInfluencer = await influencerService.getSingleInfluencer({ _id: id });

            res.json(newInfluencer);
        } catch (e) {
            next(e);
        }
    }
};