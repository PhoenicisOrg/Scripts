const OnlineInstallerScript = include("engines.wine.quick_script.online_installer_script");
const { getLatestStagingVersion } = include("engines.wine.engine.versions");

const CSMT = include("engines.wine.plugins.csmt");
const VirtualDesktop = include("engines.wine.plugins.virtual_desktop");

new OnlineInstallerScript()
    .name("Guild Wars 2")
    .editor("ArenaNet")
    .applicationHomepage("https://www.guildwars2.com")
    .author("Plata")
    .url("https://s3.amazonaws.com/gw2cdn/client/branches/Gw2Setup.exe")
    .checksum("febee41863ed7b844ea683f0931b9e7b0c9ee064")
    .category("Games")
    .executable("Gw2.exe")
    .wineVersion(getLatestStagingVersion)
    .wineDistribution("staging")
    .preInstall((wine) => {
        // avoid that launcher freezes the complete system
        new VirtualDesktop(wine).withDimensions(1280, 1024).go();
        new CSMT(wine).go();
    });
