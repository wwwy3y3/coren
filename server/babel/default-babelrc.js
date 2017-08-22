module.exports = {
  presets: [
    require.resolve('babel-preset-react'),
    require.resolve('babel-preset-es2015')
  ],
  plugins: [
    require.resolve('babel-plugin-transform-decorators-legacy'),
    require.resolve('babel-plugin-transform-class-properties'),
    require.resolve('babel-plugin-add-module-exports')
  ]
};
