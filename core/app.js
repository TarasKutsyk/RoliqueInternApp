const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');

const { PORT, MONGO_URL, ALLOWED_ORIGIN } = require('./config/config');
const { apiRouter, notFound } = require('./routes');

const app = express();

_connectDb();

const configureCors = (origin, callback) => {
    const whiteList = ALLOWED_ORIGIN.split(';');

    if (!origin) {
        return callback(null, true);
    }

    if (!whiteList.includes(origin)) {
        return callback(new Error('Cors not allowed'), false);
    }

    return callback(null, true);
};

app.use(cors({ origin: configureCors }));

app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'core', 'static')));

app.use('/', apiRouter);
app.use('*', notFound);

console.log(dotenv);

app.listen(PORT, () => {
    console.log(`App listen ${PORT}`);
});

function _connectDb() {
    mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

    const { connection } = mongoose;

    connection.on('error', (error) => {
        console.log(error);
    });
}
