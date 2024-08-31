require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const error = require('../middlewares/error');
const routes = require('../routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../doc/swagger.json');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(routes);

app.use(error);

module.exports = app;
