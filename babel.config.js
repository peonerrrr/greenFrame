module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}]
  ],
  plugins: [
    // Add any necessary Babel plugins here, e.g., for class properties
    "@babel/plugin-proposal-class-properties"
  ]
};
