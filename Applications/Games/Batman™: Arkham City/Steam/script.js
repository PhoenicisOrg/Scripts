include(["Engines", "Wine", "QuickScript", "SteamScript"]);

new SteamScript()
    .name("Batman™: Arkham City")
    .editor("Rocksteady Studios")
    .author("ImperatorS79")
    .wineVersion(LATEST_STAGING_VERSION)
    .wineDistribution("staging")
    .appId(200260)
    .postInstall(function(wine, wizard) {
        wine.enableCSMT();
    })
    .go(); 
 
