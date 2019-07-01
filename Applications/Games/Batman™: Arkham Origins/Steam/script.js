include("engines.wine.quick_script.steam_script");
include("engines.wine.plugins.csmt");

new SteamScript()
    .name("Batman™: Arkham Origins")
    .editor("WB Games Montreal, Splash Damage")
    .author("ImperatorS79")
    .wineVersion(LATEST_STAGING_VERSION)
    .wineDistribution("staging")
    .postInstall(function (wine, wizard) {
        wine.enableCSMT();
        //maybe needs xact
    })
    .appId(209000);
