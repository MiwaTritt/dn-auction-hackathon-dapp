module.exports = {
  webpack: (config, { dev }) => {
    config.module.rules.push(
      {
        test: /\.(s*)css$/,
        use: ["css-loader", "sass-loader"]
      },
      {
        test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {}
          }
        ]
      }
    );
    return config;
  }
};
