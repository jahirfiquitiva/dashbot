/* eslint-disable max-len,max-lines-per-function */
const github = require('./github');
const filteredMessages = require('./filtered.json');

const channels = {
  general: '<#702900511963086981>',
  random: '<#704341896654225478>',
  frames: '<#702902267950661792>',
  kuper: '<#702902284283150436>',
  blueprint: '<#702902327732076584>',
  dashbud: '<#706705592760139858>',
};

const dashbudMessage = 'Feel free to use https://dashbud.dev to setup any dashboard! :grinning:';

const wikiMessage = 'Be sure to check the project wiki:\n'
  + '* [Frames Wiki](https://github.com/jahirfiquitiva/Frames/wiki)\n'
  + '* [Kuper Wiki](https://github.com/jahirfiquitiva/Kuper/wiki)\n'
  + '* [Blueprint Wiki](https://github.com/jahirfiquitiva/Blueprint/wiki)';

const donationMessage = 'If you\'ve found the dashboards '
  + 'or the [setup website](https://dashbud.dev) useful, '
  + 'you can support my work by donating via:\n\n'
  + '* [GitHub Sponsors](https://github.com/sponsors/jahirfiquitiva)\n'
  + '* [Buy me a pizza](https://buymeacoff.ee/jahirfiquitiva)\n'
  + '* [PayPal](https://jahir.xyz/DonatePayPal)\n'
  + 'Thanks in advance! :hugging:\n\n'
  + '> *Don\'t forget to request the `supporter` role in <#704341896654225478> after you donate*\n'
  + '> *Also, keep in mind GitHub sponsors get some rewards!*  :wink:';

const helpMessage = `
:wave:  ***HELLO, THIS IS DASHBOT!***  :robot:

***SERVER RULES***
:one: Be friendly and respectful
:two: I don't accept friend requests
:three: *Please be patient* - Jahir might be busy or unavailable, but this server is full of people willing to help :blush:
:four: Please use the right channel for questions related to a specific dashboard (${channels.frames}, ${channels.kuper}, ${channels.blueprint} or ${channels.dashbud})
:five: If your inquiry isn't really related to any dashboard, please use ${channels.random}

***AVAILABLE COMMANDS***
:one: \`?version x\`  →  Get the latest version code for the given [x] project (also \`?v\`)
:two: \`?version\` and \`?versions\`  →  Get the latest version codes for all projects
:three: \`?update x\`  →  Get some info on how to update the given [x] project (also \`?u\`)
:four: \`?update\` and \`?updates\`  →  Get some info on how to update all projects
:five: \`?bud\`, \`?dashbud\`, \`?setup\` and \`?config\`  →  Get some info on how to setup the dashboards
:six: \`?wiki\` and \`?wikis\`  →  Get the links for all dashboards wikis (also \`?w\`)
:seven: \`?donate\` and \`?support\`  →  Get the links for available donate options (also \`?d\`)
:eight: \`?help\` and \`?what\`  →  Show this message again (also \`?h\`)

***ROLES DESCRIPTION***
:one: \`admin\`  →  Some recognized developers and designers who have enough experience to provide support and moderate the server. **Don't ask for it.**
:two: \`supporter\`  →  You get this when you donate or have donated before. Send a message in ${channels.random} if you have and want it.
:three: \`friends\`  →  I didn't want to create a new server to have fun with close friends :sweat_smile:

**Please consider donating to support future development. Just use the \`?d\` command.
Thanks in advance! :hugging:**
`;

// eslint-disable-next-line max-statements
const handleCommands = async (message) => {
  const { cleanContent: text = '', channel } = message;
  const { name: channelName } = channel;

  const args = text.slice(process.env.BOT_COMMAND_KEY.length).split(/ +/);
  const command = args.shift().toLowerCase();
  const [firstParam] = args;

  switch (command) {
    case 'v':
    case 'version': {
      const responses = await github.getDashboardsLatestRelease(channelName, firstParam);
      return message.channel.send(responses.join('\n'));
    }
    case 'versions': {
      const responses = await github.getDashboardsLatestRelease();
      return message.channel.send(responses.join('\n'));
    }
    case 'u':
    case 'update':
    case 'updates': {
      const { name: channelName } = channel;
      const response = await github.getDashboardsUpdateMessage(channelName, firstParam);
      return message.channel.send({
        embed: {
          color: 1752220,
          description: response,
        },
      });
    }
    case 'bud':
    case 'dashbud':
    case 'config':
    case 'setup': {
      await message.channel.send(dashbudMessage);
      await message.channel.send({
        embed: {
          color: 10181046,
          description: wikiMessage,
        },
      });
      return null;
    }
    case 'w':
    case 'wiki':
    case 'wikis': {
      return message.channel.send({
        embed: {
          color: 3066993,
          description: wikiMessage,
        },
      });
    }
    case 'd':
    case 's':
    case 'donate':
    case 'support': {
      return message.channel.send({
        embed: {
          color: 15844367,
          description: donationMessage,
        },
      });
    }
    case 'h':
    case 'what':
    case 'help': {
      return message.channel.send(helpMessage);
    }
    default:
      return null;
  }
};

const handleSimpleMessage = async (message) => {
  const { cleanContent: text = '' } = message;
  if (!text || text.length <= 0) return;
  for (const filtered of filteredMessages) {
    const included = filtered.keywords.filter(
      // eslint-disable-next-line prefer-template
      (kw) => (new RegExp('\\b' + kw.toLowerCase() + '\\b').test(text.toLowerCase())));
    if (included.length > 0) {
      message.reply((filtered.response || []).join('\n'));
      break;
    }
  }
};

module.exports = {
  handleSimpleMessage,
  handleCommands,
};
