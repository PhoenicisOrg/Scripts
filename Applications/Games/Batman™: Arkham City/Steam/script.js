include("engines.wine.quick_script.steam_script");
include("engines.wine.plugins.csmt");

new SteamScript()
    .name("Batman™: Arkham City")
    .editor("Rocksteady Studios")
    .author("ImperatorS79")
    .wineVersion(LATEST_STAGING_VERSION)
    .wineDistribution("staging")
    .appId(200260)
    .postInstall(function (wine, wizard) {
        wine.enableCSMT();
    });
