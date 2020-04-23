const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bot = require('./index');

const updatesRoutes = require('./routes/updates');

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.discordClient = bot;
  next();
});

app.use('/api/', (req, res) => {
  return res.send({ success: true, alive: true, status: 'ok', much: 'wow' });
});

app.use('/api/updates', updatesRoutes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});