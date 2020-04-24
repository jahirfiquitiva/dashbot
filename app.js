require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const statusRoutes = require('./routes/status');
const updatesRoutes = require('./routes/updates');

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', statusRoutes);
app.use('/api/updates', updatesRoutes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
