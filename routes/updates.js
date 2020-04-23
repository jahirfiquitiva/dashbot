const express = require('express');
const axios = require('axios');
const { titleCase } = require('./../utils');

const router = express.Router();

const baseUrl = 'https://api.github.com';

const notifyUpdate = (req, res) => {
  const { repo, tag, token, apk } = req.body;
  if (!repo || !tag) return res.status(500).send({ error: 'Missing parameters' });
  if (!token || token.toString() !== process.env.NOTIFIER_KEY) {
    return res.status(500)
      .send({ error: 'You\'re not allowed to use this!' });
  }
  return axios.get(`${baseUrl}/repos/jahirfiquitiva/${repo}/releases/tags/${tag}`)
    .then((response) => {
      const { cache: channels = [] } = req.discordClient.channels;
      const channel = channels.find((it) => it.name.toLowerCase() === repo.toLowerCase());
      if (channel) {
        const downloadUrl = apk.toString() || `https://jahir.dev/gh-releases/${repo.toLowerCase()}`;
        let messageBody = `**Changes:**\n${response.data.body || ''}`;
        messageBody += '\n\n**Useful links:**';
        messageBody += '\n* [How to update?](https://github.com/jahirfiquitiva/';
        messageBody += `${titleCase(repo)}/wiki/How-to-update)`;
        messageBody += '\n* [Download sample APK](';
        messageBody += downloadUrl;
        messageBody += ')\n* [Donate & support future development](https://jahir.dev/donate)';
        channel.send({
          embed: {
            title: `New update available! (${tag})`,
            color: 15844367,
            description: messageBody,
          },
        }).then((newMessage) => newMessage.pin())
          .catch((err) => console.error(err));
      }
      return res.send({ success: true });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ error: err.message });
    });
};

router.post('/notify', notifyUpdate);

module.exports = router;
