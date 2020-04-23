const github = require('./github');
const filteredMessages = require('./filtered.json');

const handleCommands = async (message) => {
  const { cleanContent: text = '', channel } = message;

  const args = text.slice(process.env.BOT_COMMAND_KEY.length).split(/ +/);
  const command = args.shift().toLowerCase();

  switch (command) {
    case 'version': {
      const { name: channelName } = channel;
      const responses = await github.getDashboardsLatestRelease(channelName);
      return message.channel.send(responses.join('\n'));
    }
    case 'update': {
      const { name: channelName } = channel;
      const response = await github.getDashboardsUpdateMessage(channelName);
      return message.channel.send({
        embed: {
          color: 1752220,
          description: response,
        },
      });
    }
    default:
      return null;
  }
};

const handleSimpleMessage = (message) => {
  const { cleanContent: text = '' } = message;
  for (const filtered of filteredMessages) {
    const included = filtered.keywords.filter(
      (kw) => text.toLowerCase().includes(kw.toLowerCase()));
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
