include(["Engines", "Wine", "QuickScript", "SteamScript"]);
include(["Engines", "Wine", "Verbs", "uplay"]);

new SteamScript()
    .name("Trackmania® Turbo")
    .editor("Nadeo")
    .author("Plata")
    .appId(375900)
    .wineVersion(LATEST_STAGING_VERSION)
    .wineDistribution("staging")
    .postInstall(function(wine, wizard) {
        wine.uplay();
    })
    .go();
