const axios = require('axios');
const { titleCase } = require('./utils');

const baseUrl = 'https://api.github.com';

const getLatestRelease = (repo, single) => {
  return axios.get(`${baseUrl}/repos/jahirfiquitiva/${repo}/releases/latest`)
    .then((res) => {
      return [`${single ? '' : '* '}${titleCase(repo)} => ${res.data.tag_name}`];
    })
    .catch((err) => [err.message || 'Unexpected error!']);
};

const getDashboardsLatestRelease = (repo) => {
  const dashboards = ['frames', 'kuper', 'blueprint'];
  if (repo && repo.length > 0 && dashboards.includes(repo.toLowerCase())) {
    return getLatestRelease(repo, true);
  }
  const mapped = dashboards.map((it) => getLatestRelease(it, false));
  return Promise.all(mapped)
    .then((responses) => responses.flat())
    .catch(() => []);
};

const getSingleDashboardsUpdateMessage = (repo) => {
  return `Learn how to update ${titleCase(repo)} by reading `
    + `[the wiki guide](https://github.com/jahirfiquitiva/${titleCase(repo)}/wiki/How-to-update)`;
};

const getDashboardsUpdateMessage = (repo) => {
  const dashboards = ['frames', 'kuper', 'blueprint'];
  if (repo && repo.length > 0 && dashboards.includes(repo.toLowerCase())) {
    return getSingleDashboardsUpdateMessage(repo);
  }
  return 'Learn how to update the dashboards by reading its wiki guide:\n'
    + '* [Frames Wiki](https://github.com/jahirfiquitiva/Frames/wiki/How-to-update)\n'
    + '* [Kuper Wiki](https://github.com/jahirfiquitiva/Kuper/wiki/How-to-update)\n'
    + '* [Blueprint Wiki](https://github.com/jahirfiquitiva/Blueprint/wiki/How-to-update)';
};

module.exports = {
  getDashboardsLatestRelease,
  getDashboardsUpdateMessage,
};
