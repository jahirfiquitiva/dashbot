/* eslint-disable no-console */
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { handleCommands, handleSimpleMessage } = require('./functions');

const jahirUserId = (process.env.JAHIR_USER_ID || '').toString();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.MessageContent,
  ],
});

const deletedMessages = new WeakSet();

const isMessageDeleted = (message) => {
  return deletedMessages.has(message);
};

const markMessageAsDeleted = (message) => {
  deletedMessages.add(message);
};

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

client.on('messageCreate', async (message) => {
  const { cleanContent: text = '', author = {}, authorId, type, reference } = message;

  let referenceToJahir = false;
  if (reference != null) {
    const { messageId } = reference;
    const referencedMessage = await message.channel.messages.fetch(messageId).catch(console.error);
    if (referencedMessage) {
      const { authorId } = referencedMessage;
      referenceToJahir = authorId === jahirUserId;
    }
  }

  if (type === 'PINS_ADD') {
    message.delete().catch(console.error);
    return;
  }
  const actualAuthor = author.id || authorId || '';
  // Do not reply to other bots, if the message was deleted
  if (
    isMessageDeleted(message) ||
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
    if (!jahirSentMessage(actualAuthor, author) && !referenceToJahir) {
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
    if (jahirSentMessage(actualAuthor, authorId)) return;
    await handleSimpleMessage(message).catch(console.error);
  }
});

client.on('messageDelete', async (message) => {
  markMessageAsDeleted(message);
});

// Initialize discord client
try {
  client.login(process.env.BOT_TOKEN || '').catch(() => {
    console.error('Error connecting to Discord');
  });
} catch (e) {}

module.exports = client;
