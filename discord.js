/* eslint-disable no-console */
require('dotenv').config();
const Discord = require('discord.js');
const { handleCommands, handleSimpleMessage } = require('./functions');

const client = new Discord.Client();

// Quick validation of whether a message was sent by Jahir or not
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
  // Do not reply to other bots, if the message was deleted, or user is Jahir
  if (deleted || author.bot
    || actualAuthor.toString() === (process.env.BOT_USER_ID || '').toString()
    || jahirSentMessage(actualAuthor, author)) {
    return;
  }

  // Quick check if Jahir is mentioned, and if so, tell them to stop
  message.mentions.users.each(user => {
    if(user.username === 'jahirfiquitiva') {
      message.reply(`Please don't mention Jahir; he checks this server regularly and will get back to you as soon as he can.`);
    }
  })

  // If message is a command handle it, otherwise check if message includes some keywords
  // and reply accordingly
  if (text.startsWith(process.env.BOT_COMMAND_KEY)) {
    await handleCommands(message).catch((err) => console.error(err));
  } else {
    await handleSimpleMessage(message).catch((err) => console.error(err));
  }
});

// Initialize discord client
try {
  client.login(process.env.BOT_TOKEN || '')
    .catch(() => {
      console.error('Error connecting to Discord');
    });
} catch (e) {
}

module.exports = client;
