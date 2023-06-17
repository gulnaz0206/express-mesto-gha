/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable indent */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (email) => validator.isEmail(email),
            message: ({ value }) => `${value} некорректный, попробуйте использовать другой email`,
        },
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    name: {
        type: String,
        minlength: 2,
        maxlength: 30,
        default: 'Жак-Ив Кусто',
        validator: (value) => validator.isAlpha(value),
        message: 'Некорректное имя',
    },
    about: {
        type: String,
        minlength: 2,
        maxlength: 30,
        default: 'Исследователь',
        validator: (value) => validator.isAlpha(value),
        message: 'Некорректное описание',
    },
    avatar: {
        type: String,
        validate: {
            validator: (value) => validator.isUrl(value),
            message: 'Некорректная ссылка',
        },
        default: '',
    },
}, { toJSON: { useProjection: true }, toObject: { useProjection: true }});

userSchema.statics.findUserByCredentials = async function findUserByCredentials(email, password) {
    try {
        const user = await this.findOne({ email }).select('+password');
        if (!user) {
            const error = await this.Unauthorized('Неправильно введена почта или пароль');
            throw error;
        }
        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
            const error = new Error('Неправильно введена почта или пароль');
            throw error;
        }
        return user;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
};
module.exports = mongoose.model('user', userSchema);
