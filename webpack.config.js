const path = require("path");
const minJSON = require("jsonminify");
const webpack = require("webpack");
const { SubresourceIntegrityPlugin } = require("webpack-subresource-integrity");

const plugins = {
  progress: require("webpackbar"),
  clean: (() => {
    const { CleanWebpackPlugin } = require("clean-webpack-plugin");
    return CleanWebpackPlugin;
  })(),
  extractCSS: require("mini-css-extract-plugin"),
  sync: require("browser-sync-webpack-plugin"),
  html: require("html-webpack-plugin"),
  copy: require("copy-webpack-plugin"),
  sri: SubresourceIntegrityPlugin,
};

module.exports = (env = {}, argv) => {
  const isProduction = argv.mode === "production";

  let config = {
    context: path.resolve(__dirname, "src"),

    entry: {
      vendor: ["./styles/vendor.scss", "./scripts/vendor.js"],
      app: ["./styles/app.scss", "./scripts/app.js"],
    },

    output: {
      path: path.resolve(__dirname, "dist"),
      publicPath: "",
      filename: "scripts/[name].js",
      crossOriginLoading: "anonymous",
    },

    module: {
      rules: [
        {
          test: /\.((s[ac]|c)ss)$/,
          use: [
            {
              loader: plugins.extractCSS.loader,
              options: {
                publicPath: "../", // use relative path for everything in CSS
              },
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                sourceMap: !isProduction,
                postcssOptions: {
                  ident: "postcss",
                  plugins: [
                    require("autoprefixer")(),
                    ...(isProduction
                      ? [
                          require("cssnano")({
                            preset: [
                              "default",
                              {
                                minifySelectors: false,
                              },
                            ],
                          }),
                        ]
                      : []),
                  ],
                },
              },
            },
            {
              loader: "sass-loader",
              options: {
                implementation: require("sass"),
                sassOptions: {
                  fiber: require("fibers"),
                  outputStyle: "expanded",
                  sourceMap: !isProduction,
                },
              },
            },
          ],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          exclude: /fonts/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[path][name].[ext]",
                // publicPath: '..' // use relative path
              },
            },
            {
              loader: "image-webpack-loader",
              options: {
                disable: !isProduction,
                mozjpeg: {
                  progressive: true,
                  quality: 65,
                },
                optipng: {
                  enabled: false,
                },
                pngquant: {
                  quality: [0.65, 0.9],
                  speed: 4,
                },
                gifsicle: {
                  interlaced: false,
                },
                webp: {
                  quality: 75,
                },
              },
            },
          ],
        },
        {
          test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
          exclude: /images/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "fonts/",
                // publicPath: '../fonts/' // use relative path
              },
            },
          ],
        },
        {
          test: /\.html$/,
          use: {
            loader: "html-loader",
          },
        },
      ],
    },

    devServer: {
      port: 8080,
      client: {
        overlay: {
          warnings: true,
          errors: true,
        },
      },
    },

    plugins: (() => {
      let common = [
        new plugins.extractCSS({
          filename: "styles/[name].css",
        }),
        new plugins.html({
          template: "index.html",
          filename: "index.html",
          minify: {
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
          },
        }),
        new plugins.progress({
          color: "#5C95EE",
        }),
        new webpack.DefinePlugin({
          "process.env.NODE_ENV": JSON.stringify(
            isProduction ? "production" : "development"
          ),
        }),
      ];

      const production = [
        new plugins.clean(),
        new plugins.copy({
          patterns: [
            {
              from: "data/**/*.json",
              transform: (content) => minJSON(content.toString()),
            },
          ],
        }),
        new SubresourceIntegrityPlugin({
          hashFuncNames: ["sha384"],
          enabled: true,
        }),
      ];

      const development = [
        new plugins.sync(
          {
            host: "localhost",
            port: 9090,
            proxy: "http://localhost:8080/",
          },
          {
            reload: false,
          }
        ),
      ];

      return isProduction
        ? common.concat(production)
        : common.concat(development);
    })(),
    // uncomment in development mode

    // devtool: (() => {
    //   return "source-map";
    // })(),

    resolve: {
      modules: [path.resolve(__dirname, "src"), "node_modules"],
      alias: {
        "~": path.resolve(__dirname, "src/scripts/"),
      },
    },

    stats: "errors-only",
  };

  return config;
};
