/* eslint-disable no-console */
require('dotenv').config();
const Discord = require('discord.js');
const { handleCommands, handleSimpleMessage } = require('./functions');

const client = new Discord.Client();

const jahirSentMessage = (actualAuthor, author) => {
  // TODO: Enable if testing
  // return false;
  return actualAuthor.toString() === (process.env.JAHIR_USER_ID || '').toString()
    || (author ? author.username || '' : '') === 'jahirfiquitiva';
};

client.once('ready', () => {
  console.log('Discord bot is ready!!');
});

client.on('message', async (message) => {
  const { cleanContent: text = '', author = {}, deleted, type } = message;
  if (type === 'PINS_ADD') {
    message.delete().catch((err) => console.error(err));
    return;
  }
  const actualAuthor = author.id || '';
  if (deleted || author.bot
    || actualAuthor.toString() === (process.env.BOT_USER_ID || '').toString()
    || jahirSentMessage(actualAuthor, author)) {
    return;
  }
  if (text.startsWith(process.env.BOT_COMMAND_KEY)) {
    await handleCommands(message).catch((err) => console.error(err));
  } else {
    await handleSimpleMessage(message).catch((err) => console.error(err));
  }
});

try {
  client.login(process.env.BOT_TOKEN || '')
    .catch(() => {
      console.error('Error connecting to Discord');
    });
} catch (e) {
}

module.exports = client;
