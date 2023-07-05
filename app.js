require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const auth = require('./middlewares/auth');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const NotFound = require('./errors/NotFound');
// const errorHandle = require('./middlewares/errorHandle');
const { authValidation, regValidation } = require('./middlewares/validation');
const { login, createUser } = require('./controllers/users');
const { errors } = require('celebrate');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

mongoose.connect(DB_URL)
  .then(() => console.log('connected'))
  .catch((err) => console.log(`Ошибка ${err}: ${err.message}`));

app.use(express.json());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.post('/signin', authValidation, login);
app.post('/signup', regValidation, createUser);
app.use('/', auth, userRouter);
app.use('/', auth, cardRouter);
app.use('/', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
