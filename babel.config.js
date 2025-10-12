const path = require('path');

const appRoot = path.resolve(__dirname, 'app');

if (!process.env.EXPO_ROUTER_APP_ROOT) {
  process.env.EXPO_ROUTER_APP_ROOT = appRoot;
}

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['expo-router/babel', { appDir: appRoot }],
      'react-native-reanimated/plugin',
    ],
  };
};
