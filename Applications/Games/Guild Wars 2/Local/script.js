include("engines.wine.quick_script.local_installer_script");
include("engines.wine.plugins.csmt");
include("engines.wine.plugins.virtual_desktop");

new LocalInstallerScript()
    .name("Guild Wars 2")
    .editor("ArenaNet")
    .applicationHomepage("https://www.guildwars2.com")
    .author("Plata")
    .category("Games")
    .executable("Gw2.exe")
    .wineVersion(LATEST_STAGING_VERSION)
    .wineDistribution("staging")
    .preInstall(function (wine /*, wizard*/) {
        // avoid that launcher freezes the complete system
        wine.setVirtualDesktop(1280, 1024);
        wine.enableCSMT();
    });
