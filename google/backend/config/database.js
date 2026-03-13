const mongoose = require('mongoose');
const dns = require('dns');

const FALLBACK_DNS_SERVERS = ['8.8.8.8', '1.1.1.1'];

const parseDnsServers = () => {
  const raw = process.env.DNS_SERVERS;
  if (!raw) return FALLBACK_DNS_SERVERS;
  return raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const isSrvDnsError = (error) => {
  const message = String(error?.message || '');
  return error?.code === 'ECONNREFUSED' || message.includes('querySrv');
};

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error(
      'Database connection error: MONGODB_URI is not defined in environment variables.'
    );
    process.exit(1);
  }

  const connect = async (uri) =>
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

  try {
    const conn = await connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Some local DNS resolvers reject SRV queries used by mongodb+srv URIs.
    // Retry once with explicit DNS servers before exiting.
    if (mongoUri.startsWith('mongodb+srv://') && isSrvDnsError(error)) {
      try {
        const dnsServers = parseDnsServers();
        dns.setServers(dnsServers);
        console.warn(`Atlas SRV DNS failed. Retrying with DNS servers: ${dnsServers.join(', ')}`);

        const conn = await connect(mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return;
      } catch (retryError) {
        console.error('Database connection error:', retryError);
        process.exit(1);
        return;
      }
    }

    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
