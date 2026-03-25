const express = require('express');
const app = express();

const db = require('./db');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Serveur OK');
});

app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});