module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      '@babel/plugin-syntax-import-meta', // CRITICAL: Silences the 'import.meta' browser crash [cite: 2025-12-23]
      'react-native-reanimated/plugin',
    ],
  };
};