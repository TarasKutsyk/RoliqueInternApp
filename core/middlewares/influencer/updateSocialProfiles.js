const { magicString: { SOCIAL_NETWORKS } } = require('../../constants');
const {
    ErrorHandler,
    errorCodes,
    errorMessages
} = require('../../error');
const { influencerService } = require('../../services');

module.exports = async (req, res, next) => {
    const {
        body,
        params: { id }
    } = req;
    const allNetworks = Object.values(SOCIAL_NETWORKS);

    try {
        const influencer = await influencerService.getInfluencerById(id);
        const socialProfiles = influencer.social_profiles.map(value => {
            const profile = value._doc;
            delete profile._id;
            return profile;
        });

        let wasChange = false;
        for (const requestKey in body) {
            const [leftPart] = requestKey.split('_');

            if (allNetworks.includes(leftPart)) {
                wasChange = true;

                const oldProfile = socialProfiles.find(profile => profile.social_network_name === leftPart);

                const profileName = body[`${leftPart}_profile`] || oldProfile.social_network_profile;
                const profileFollowers = body[`${leftPart}_followers`] || oldProfile.social_network_followers;

                if (!profileName || !profileFollowers) {
                    throw new ErrorHandler(errorCodes.BAD_REQUEST, errorMessages.BAD_SOCIAL_PROFILE.customCode,
                        'No profile data');
                }

                const newProfile = {
                    social_network_name: leftPart,
                    social_network_profile: profileName,
                    social_network_followers: profileFollowers
                };
                const profileIndex = socialProfiles.findIndex(profile => profile.social_network_name === leftPart);

                if (profileIndex === -1) {
                    socialProfiles.push(newProfile);
                } else {
                    socialProfiles[profileIndex] = newProfile;
                }

                delete body[`${leftPart}_profile`];
                delete body[`${leftPart}_followers`];
            }
        }

        if (wasChange) {
            req.body.social_profiles = socialProfiles;
        }

        next();
    } catch (e) {
        next(e);
    }
};