/* eslint-disable no-console */
require('dotenv').config();
const Discord = require('discord.js');
const { handleCommands, handleSimpleMessage } = require('./functions');

const jahirUserId = (process.env.JAHIR_USER_ID || '').toString();

const myIntents = new Discord.Intents();
myIntents.add(Discord.Intents.FLAGS.GUILDS);
myIntents.add(Discord.Intents.FLAGS.GUILD_WEBHOOKS);
myIntents.add(Discord.Intents.FLAGS.GUILD_MESSAGES);

const client = new Discord.Client({
  intents: myIntents,
});

// Quick validation of whether a message was sent by Jahir or not
const jahirSentMessage = (actualAuthor, author) => {
  return (
    actualAuthor.toString() === jahirUserId ||
    (author ? author.username || '' : '') === 'jahirfiquitiva'
  );
};

client.once('ready', () => {
  console.log('Discord bot is ready!!');
});

client.on('message', async (message) => {
  const { cleanContent: text = '', author = {}, authorId, deleted, type, reference } = message;

  /*
  if (reference != null) {
    const { messageId } = reference;
    const referencedMessage = await message.channel.messages.fetch(messageId).catch(console.error);
    if (referencedMessage) {
      const { type, authorId } = referencedMessage;
      if (type == 'REPLY') {
        // TODO: ??
      }
    }
  }
  */

  if (type === 'PINS_ADD') {
    message.delete().catch(console.error);
    return;
  }
  const actualAuthor = author.id || authorId || '';
  // Do not reply to other bots, if the message was deleted
  if (
    deleted ||
    author.bot ||
    actualAuthor.toString() === (process.env.BOT_USER_ID || '').toString()
  ) {
    return;
  }

  // Quick check if Jahir is mentioned, and if so, tell them to not do it
  const mentionedJahir = message.mentions.users.some((user) => {
    return user.username === 'jahirfiquitiva';
  });
  if (mentionedJahir) {
    if (!jahirSentMessage(actualAuthor, author)) {
      message.reply(
        `Please don't mention Jahir; he checks this server regularly and will get back to you as soon as he can.`
      );
    }
  }

  // If message is a command handle it, otherwise check if message includes some keywords
  // and reply accordingly
  if (text.startsWith(process.env.BOT_COMMAND_KEY)) {
    await handleCommands(message).catch(console.error);
  } else {
    await handleSimpleMessage(message).catch(console.error);
  }
});

// Initialize discord client
try {
  client.login(process.env.BOT_TOKEN || '').catch(() => {
    console.error('Error connecting to Discord');
  });
} catch (e) {}

module.exports = client;
