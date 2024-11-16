const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");

const commonConfig = {
  name: "FirstPage",
  author: "fribble186",
};
module.exports = {
  packagerConfig: {
    asar: true,
    icon: "build/logo.png",
    ignore: ["node_modules/"],
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: { ...commonConfig },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
      config: { ...commonConfig },
    },
    {
      name: "@electron-forge/maker-deb",
      config: { ...commonConfig },
    },
    {
      name: "@electron-forge/maker-rpm",
      config: { ...commonConfig },
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
