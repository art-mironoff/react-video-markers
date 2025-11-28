const path = require("path");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const config = require("./webpack.config");

const compiler = webpack(config);
const server = new WebpackDevServer(
  {
    static: {
      directory: path.join(__dirname, "example"),
    },
    hot: true,
    port: 3000,
    host: "localhost",
    devMiddleware: {
      stats: {
        chunkModules: false,
        colors: true,
      },
    },
  },
  compiler
);

server
  .start()
  .then(() => {
    console.log("Listening at localhost:3000");
  })
  .catch((err) => {
    console.error(err);
  });
