const Discord = require('discord.js');
const { handleCommands, handleSimpleMessage } = require('./functions');

const client = new Discord.Client();

const isWorker = process.env.IS_WORKER || false;
console.log(`Running as worker? ${isWorker}`);

if (isWorker) {
  client.once('ready', () => {
    // eslint-disable-next-line no-console
    console.log('Discord bot is ready!!');
  });

  client.on('message', async (message) => {
    const { cleanContent: text = '', author = {}, deleted, type } = message;
    if (type === 'PINS_ADD') {
      message.delete().catch();
      return;
    }
    const actualAuthor = author.id || '';
    if (deleted || author.bot
      || actualAuthor.toString() === process.env.BOT_USER_ID.toString()) {
      return;
    }
    if (text.startsWith(process.env.BOT_COMMAND_KEY)) {
      // eslint-disable-next-line no-console
      await handleCommands(message).catch((err) => console.error(err));
    } else {
      handleSimpleMessage(message);
    }
  });
}

client.login(process.env.BOT_TOKEN || '');

module.exports = client;
