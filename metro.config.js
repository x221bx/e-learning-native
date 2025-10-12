// Standard Expo Metro configuration to ensure the CLI resolves Metro correctly
const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');

const appRoot = path.resolve(__dirname, 'app');

if (!process.env.EXPO_ROUTER_APP_ROOT) {
    process.env.EXPO_ROUTER_APP_ROOT = appRoot;
}

const config = getDefaultConfig(__dirname);

module.exports = config;
