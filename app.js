/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable indent */

require('dotenv').config();
const express = require('express');
const path = require('path');
const parser = require('parser');
const mongoose = require('mongoose');
const router = require('./routes/index');

const { PORT = 4500, URL } = process.env;
const app = express();
mongoose.connect(URL);

app.use(parser());
app.use(express.json());
app.use('/', router);

app.use((req, res, next) => {
   req.user = { _id: '' };
   next();
});
app.use(router);
app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
