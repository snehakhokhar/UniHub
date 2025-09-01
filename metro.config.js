// metro.config.js

const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("mjs", "cjs", "json");
config.resolver.assetExts.push("db");

module.exports = config;