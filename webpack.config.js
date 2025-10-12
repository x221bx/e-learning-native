const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack');
const path = require('path');

module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync(env, argv);

    // Add polyfills for Node.js modules in browser
    config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
        process: require.resolve('process/browser'),
        vm: false, // vm module not needed in browser
    };

    // Provide global polyfills
    config.plugins.push(
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        })
    );

    // Ensure Expo Router knows where the app directory lives when bundling for web
    const appDirectory = path.resolve(__dirname, 'app');
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.EXPO_ROUTER_APP_ROOT': JSON.stringify(appDirectory),
      })
    );

    // Silence specific drawer legacy + reanimated export warnings on web builds
    const filterDrawerReanimated = (warning) => {
      const msg = (warning && (warning.message || warning.details || '')) + '';
      return msg.includes('@react-navigation/drawer') && msg.includes('legacy/Drawer.js') && msg.includes('react-native-reanimated');
    };
    config.ignoreWarnings = [...(config.ignoreWarnings || []), filterDrawerReanimated];

    // Avoid bundling legacy drawer implementation that imports Reanimated v1 APIs
    config.resolve.alias = {
        ...(config.resolve.alias || {}),
        '@react-navigation/drawer/lib/module/views/legacy/Drawer': path.resolve(__dirname, 'src/shims/legacyDrawerStub.js'),
        '@react-navigation/drawer/lib/commonjs/views/legacy/Drawer': path.resolve(__dirname, 'src/shims/legacyDrawerStub.js'),
    };

    return config;
};

