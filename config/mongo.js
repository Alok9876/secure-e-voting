const dns = require('node:dns');

const DEFAULT_DNS_SERVERS = ['8.8.8.8', '1.1.1.1'];

const getMongoUri = () => process.env.MONGO_URI || process.env.MONGO_URL;

const getMongoOptions = () => ({
  serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 10000),
});

const configureMongoDns = (mongoUri) => {
  if (!mongoUri || !mongoUri.startsWith('mongodb+srv://')) {
    return;
  }

  const servers = (process.env.MONGO_DNS_SERVERS || DEFAULT_DNS_SERVERS.join(','))
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  if (servers.length > 0) {
    dns.setServers(servers);
  }
};

module.exports = { configureMongoDns, getMongoOptions, getMongoUri };
