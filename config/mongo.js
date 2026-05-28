const dns = require('node:dns');

const DEFAULT_DNS_SERVERS = ['8.8.8.8', '1.1.1.1'];

const getMongoUri = () => process.env.MONGO_URI || process.env.MONGO_URL;

const uriIncludesDatabaseName = (mongoUri) => {
  try {
    const parsed = new URL(mongoUri);
    return parsed.pathname && parsed.pathname !== '/';
  } catch {
    return false;
  }
};

const getMongoOptions = (mongoUri) => {
  const options = {
    serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 10000),
  };

  if (process.env.MONGO_DB_NAME) {
    options.dbName = process.env.MONGO_DB_NAME;
  } else if (!uriIncludesDatabaseName(mongoUri)) {
    options.dbName = 'secure_evoting';
  }

  return options;
};

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
