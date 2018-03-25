include(["Engines", "Wine", "QuickScript", "SteamScript"]);
include(["Engines", "Wine", "Verbs", "uplay"]);

new SteamScript()
    .name("Tom Clancy’s The Division™")
    .editor("Massive Entertainment")
    .author("Plata")
    .appId(365590)
    .wineVersion(LATEST_STAGING_VERSION)
    .wineDistribution("staging")
    .wineArchitecture("amd64")
    .postInstall(function(wine, wizard) {
        wine.uplay();
    })
    .go();
