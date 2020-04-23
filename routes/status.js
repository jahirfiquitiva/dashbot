const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  return res.send({ success: true, alive: true, status: 'ok', much: 'wow' });
});

module.exports = router;
