module.exports = {
  //...
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      zlib: require.resolve("browserify-zlib"),
    },
  },
};
