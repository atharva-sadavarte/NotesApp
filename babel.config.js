module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.jsx', '.json', '.native.js'],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@assets': './src/assets',
          '@utils': './src/utils',
          '@navigation': './src/navigation',
          '@api': './src/api',
          '@store': './src/store',
        },
      },
    ],
  ],
};