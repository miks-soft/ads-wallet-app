module.exports = {
  presets: [
    '@rnx-kit/babel-preset-metro-react-native',
    '@babel/typescript',
    [
      '@babel/preset-react',
      {
        importSource: '@welldone-software/why-did-you-render',
        runtime: 'automatic',
        development: process.env.NODE_ENV === 'development' || false,
      },
    ],
  ],
  plugins: [
    'react-native-reanimated/plugin',
    ['lodash'],
    [
      '@babel/plugin-transform-react-jsx',
      {
        runtime: 'automatic',
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src/'],
        alias: {
          '#assets/*': './src/assets/*',
          '#components/*': './src/components/*',
          '#ui-kit/*': './src/ui-kit/*',
          '#screens/*': './src/screens/*',
          '#modals/*': './src/modals/*',
          '#navigation/*': './src/navigation/*',
          '#api/*': './src/core/api/*',
          '#hooks/*': './src/core/hooks/*',
          '#utils/*': './src/core/utils/*',
          '#services/*': './src/core/services/*',
          '#styles/*': './src/styles/*',
          '#store/*': './src/store/*',
          '#config/*': './src/config/*',
          '#localization/*': './src/localization/*',

          '#components': './src/components',
          '#ui-kit': './src/ui-kit',
          '#screens': './src/screens',
          '#modals': './src/modals',
          '#navigation': './src/navigation',
          '#api': './src/core/api',
          '#hooks': './src/core/hooks',
          '#utils': './src/core/utils',
          '#services': './src/core/services',
          '#styles': './src/styles',
          '#assets': './src/assets',
          '#store': './src/store',
          '#config': './src/config',
          '#localization': './src/localization',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '#env',
        path: './.env',
      },
    ],
  ],
};
