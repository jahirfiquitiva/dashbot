/* eslint-disable no-console */
const axios = require('axios');

const telegramBotKey = process.env.TELEGRAM_BOT_KEY || '';
const chatId = `@${process.env.TELEGRAM_CHAT_ID || ''}`;
const millisInADay = 24 * 60 * 60 * 1000;

const markup = {
  inline_keyboard: [
    [
      {
        text: 'Discord Server',
        url: 'https://discordapp.com/invite/78h7xgj',
      },
    ],
  ],
};
const actualMarkup = JSON.stringify(markup);

const messages = [
  '📢 *Friendly Daily Reminder* 📢\n',
  'We recently created a Discord Server for dashboards support and news.',
  'We encourage you to join it as it is more organized and stuff',
  '\nSee you there! 😀',
];
const actualMessage = encodeURIComponent(messages.join('\n'));

const targetUrl = `https://api.telegram.org/bot${telegramBotKey}`
  + `/sendMessage?chat_id=${chatId}&text=${actualMessage}`
  + `&parse_mode=Markdown&reply_markup=${actualMarkup}`;

const sendReminder = () => {
  try {
    axios.get(targetUrl)
      .then(() => {
        console.log('Daily reminder sent successfully!');
      })
      .catch((err) => {
        console.error((err ? err.message : err.stack).toString());
        console.error('An unexpected error occurred while sending the daily reminder');
      });
  } catch (e) {
  }
};

setInterval(sendReminder, millisInADay);
sendReminder();
