import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { rspack } from "@rspack/core";
import RefreshPlugin from "@rspack/plugin-react-refresh";
import { withZephyr } from "zephyr-rspack-plugin";
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === "development";

export default withZephyr()({
  context: __dirname,
  entry: {
    main: "./src/main.jsx"
  },
  resolve: {
    extensions: ["...", ".ts", ".tsx", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: "asset"
      },
      {
        test: /\.(jsx?|tsx?)$/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true
                },
                transform: {
                  react: {
                    runtime: "automatic",
                    development: isDev,
                    refresh: isDev
                  }
                }
              },
              env: {
                targets: [
                  "chrome >= 87",
                  "edge >= 88",
                  "firefox >= 78",
                  "safari >= 14"
                ]
              }
            }
          }
        ]
      }
    ]
  },
  output: {
    publicPath: 'http://localhost:8080/',
    uniqueName: 'host'
  },
  devServer: {
    port: 8080,
    hot: true,
    historyApiFallback: true,
    allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0']
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.jsx',
      },
      remotes: {
       remoteApp: 'remote@http://localhost:8081/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: '^19.1.0' },
        'react-dom': { singleton: true, eager: true, requiredVersion: '^19.1.0' }
      }
    }),
    new rspack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }),
    new rspack.ProgressPlugin({}),
    new rspack.HtmlRspackPlugin({
      template: "./index.html"
    }),
    isDev ? new RefreshPlugin() : null
  ].filter(Boolean),
  experiments: {
    css: true
  }
});

