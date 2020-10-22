const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const environment = require("../environment");

const PATHS = {
  root: path.join(__dirname, "../"),
  src: path.join(__dirname, "../src"),
	dist: path.join(__dirname, "../dist")
}

const ENV = process.env.NODE_ENV || environment.DEV;
const isDevelopment = (ENV === environment.DEV);

const baseStyleLoaders = [
	MiniCssExtractPlugin.loader,
  {
    loader: "css-loader",
    options: {
      sourceMap: isDevelopment
    }
  },
  {
    loader: "postcss-loader",
    options: {
      sourceMap: isDevelopment,
      postcssOptions: {
        plugins: [
					require('autoprefixer')
				]
      }
    }
  }
];

module.exports = {
  entry: {
    index: path.join(PATHS.src, "index.ts")
  },
  externals: {
    paths: PATHS,
  },
  output: {
    path: PATHS.dist,
    filename: "[name].js",
		library: "RadarChart",
  },
  resolve: {
    modules: ["node_modules"],
    extensions: ["*", ".ts", ".js"]
  },
  resolveLoader: {
    modules: ["node_modules"],
    extensions: ["*", ".js"]
  },
  module: {
    rules: [
      {
				test: /\.ts$/,
				use: ["ts-loader"]
      },
      {
        test: /\.css$/,
        use: [...baseStyleLoaders]
      },
      {
        test: /\.scss$/,
        use: [
          ...baseStyleLoaders,
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDevelopment
            }
          }
        ]
      }
    ]
	},
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "styles.css"
		})
  ],
}
