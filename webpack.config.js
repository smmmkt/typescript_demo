export default {
  target: "node",
  entry: {
    index: "./index.ts",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_module/,
      },
    ],
  },
  output: {
    filename: "[name].cjs",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  optimization: {
    usedExports: "global",
  },
};
