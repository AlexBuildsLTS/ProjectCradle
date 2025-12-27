const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// SVG Transformer Logic
config.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
config.resolver.sourceExts.push("svg");

// Path Aliasing
config.resolver.alias = {
  "@": path.resolve(__dirname, "./"),
};

// Ensure this matches your global CSS location
module.exports = withNativeWind(config, { input: "./global.css" });
