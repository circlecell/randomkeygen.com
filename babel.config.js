module.exports = {
  presets: [['@babel/preset-env', {
    targets: {
      browsers: ['last 3 versions']
    }
  }]],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
  ],
};
