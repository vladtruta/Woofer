'use strict';

const IP   = '127.0.0.1';
const PORT = 8080;

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

app.set('case sensitive routing', false);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/application', express.static(path.join(__dirname, 'application')));

app.get('/', (request, response) => {
  response.redirect('/application');
});

app.get('*', (request, response) => {
  response.status(404).send(`You've been told the wrong way mate. Nothing here yet.`);
});

const listener = app.listen(PORT, IP, () => {
  const {address, port} = listener.address();

  console.log(`Server up and running oh http://${address}:${PORT}`);
});