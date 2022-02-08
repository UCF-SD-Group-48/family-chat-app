// Configuration file for Babel, to translate React and ES5+ for older JavaScript environments.

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
