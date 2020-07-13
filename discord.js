/* eslint-disable no-console */
require('dotenv').config();
const got = require('got');
const Discord = require('discord.js');
const { handleCommands, handleSimpleMessage } = require('./functions');

const { REMINDERS_HOOK: remindersHook = '' } = process.env;

const reminderMessage = 'Here\'s just a friendly reminder that if you\'ve found the dashboards '
  + 'or the [setup website](https://dashbud.dev) useful, '
  + 'you can support my work by donating via:\n\n'
  + '* [GitHub Sponsors](https://github.com/sponsors/jahirfiquitiva) (monthly)\n'
  + '* [Buy me a pizza](https://buymeacoff.ee/jahirfiquitiva) (one-time or monthly)\n'
  + '* [PayPal](https://jahir.xyz/DonatePayPal) (one-time)\n\n'
  + 'Thanks in advance! :hugging:\n\n'
  + '> *Don\'t forget to request the `supporter` role in <#702900511963086981> after you donate*\n'
  + '> *Also, GitHub sponsors get some rewards!*  :wink:';

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

const sendWeeklyReminder = async () => {
  if (!remindersHook || remindersHook.length <= 0) return;
  try {
    // noinspection JSCheckFunctionSignatures
    await got.post(remindersHook, {
      json: {
        embeds: [{
          title: ':wave:  Hello everyone! :grinning: ',
          description: reminderMessage,
          color: 15844367,
        }],
      },
      responseType: 'json',
    });
    console.log(`Reminder sent @ ${new Date().toISOString()}`);
  } catch (e) {
    console.log('Error sending reminder');
    console.error(e);
  }
};

/*
sendWeeklyReminder()	
  .catch((e) => {	
    console.error(e);	
  });
*/

module.exports = client;
