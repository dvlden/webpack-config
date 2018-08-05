const path = require('path')
const webpack = require('webpack')
const minJSON = require('jsonminify')

const plugins = {
  progress: require('webpackbar'),
  clean: require('clean-webpack-plugin'),
  extractCSS: require('mini-css-extract-plugin'),
  // extractText: require('extract-text-webpack-plugin'),
  sync: require('browser-sync-webpack-plugin'),
  html: require('html-webpack-plugin'),
  copy: require('copy-webpack-plugin'),
  sri: require('webpack-subresource-integrity')
}

module.exports = (env = {}, argv) => {
  const isProduction = argv.mode === 'production'

  let config = {
    context: path.resolve(__dirname, 'src'),

    entry: {
      vendor: [
        './styles/vendor.scss',
        './scripts/vendor.js'
      ],
      app: [
        './styles/app.scss',
        './scripts/app.js'
      ]
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '',
      filename: 'scripts/[name].js',
      crossOriginLoading: 'anonymous'
    },

    module: {
      rules: [
        {
          test: /\.((s[ac]|c)ss)$/,
          use: [
            plugins.extractCSS.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: ! isProduction
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                sourceMap: ! isProduction,
                plugins: (() => {
                  return isProduction ? [
                    require('autoprefixer')(),
                    require('cssnano')({
                      preset: ['default', {
                        minifySelectors: false
                      }]
                    })
                  ] : []
                })()
              }
            },
            {
              loader: 'sass-loader',
              options: {
                outputStyle: 'expanded',
                sourceMap: ! isProduction
              }
            }
          ]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env'
              ]
            }
          }
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          exclude: /fonts/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].[ext]',
                publicPath: '..' // use relative urls
              }
            },
            {
              loader: 'image-webpack-loader',
              options: {
                bypassOnDebug: ! isProduction,
                mozjpeg: {
                  progressive: true,
                  quality: 65
                },
                optipng: {
                  enabled: false
                },
                pngquant: {
                  quality: '65-90',
                  speed: 4
                },
                gifsicle: {
                  interlaced: false
                }
              }
            }
          ]
        },
        {
          test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
          exclude: /images/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
              publicPath: '../fonts/' // use relative urls
            }
          }]
        },
        {
          test: /\.html$/,
          use: {
            loader: 'html-loader',
            options: {
              minimize: true,
              removeComments: true,
              collapseWhitespace: true,
              removeScriptTypeAttributes: true,
              removeStyleTypeAttributes: true
            }
          },
        }
      ]
    },

    devServer: {
      contentBase: path.join(__dirname, 'src'),
      port: 8080,
      overlay: {
        warnings: true,
        errors: true
      },
      quiet: true,
      // open: true
    },

    plugins: (() => {
      let common = [
        new plugins.extractCSS({
          filename: 'styles/[name].css'
        }),
        new plugins.html({
          template: 'index.html',
          filename: 'index.html',
          minify: {
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
          }
        }),
        new plugins.progress({
          color: '#5C95EE'
        })
      ]

      const production = [
        new plugins.clean(['dist']),
        new plugins.copy([
          {
            from: 'data/**/*.json',
            // to: '',
            transform: content => {
              return minJSON(content.toString())
            }
          }
        ]),
        new plugins.sri({
          hashFuncNames: ['sha384'],
          enabled: true
        })
      ]

      const development = [
        new plugins.sync(
          {
            host: 'localhost',
            port: 9090,
            proxy: 'http://localhost:8080/'
          },
          {
            reload: false
          }
        )
      ]

      return isProduction
        ? common.concat(production)
        : common.concat(development)
    })(),

    devtool: (() => {
      return isProduction
        ? '' // 'hidden-source-map'
        : 'source-map'
    })(),

    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        '~': path.resolve(__dirname, 'src/scripts/')
      }
    }
  }

  return config
};
