// Standard Expo Metro configuration to ensure the CLI resolves Metro correctly
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
