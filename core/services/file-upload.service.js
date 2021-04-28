const cloudinary = require('cloudinary').v2;
const path = require('path');
const DatauriParser = require('datauri/parser');

const parser = new DatauriParser();

const {
    config: {
        CLOUDINARY_NAME,
        CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET
    }
} = require('../config');

cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

module.exports = {
    uploadFile: (file) => {
        const file64 = parser.format(path.extname(file.name)
            .toString(), file.data);

        return cloudinary.uploader.upload(file64.content);
    },
    uploadRawFile: async (rawFile) => {
        const arrData = await rawFile.arrayBuffer();
        const buffer = Buffer.from(arrData);

        const file64 = parser.format('.jpg', buffer);
        return cloudinary.uploader.upload(file64.content);
    },

    removeFile: (file) => {
        const arrString = file.split('.');
        const string = arrString[arrString.length - 2].split('/')
            .pop();
        // eslint-disable-next-line require-await
        cloudinary.uploader.destroy(string, async (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
};
