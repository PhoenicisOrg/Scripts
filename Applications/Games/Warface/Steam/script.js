include(["engines", "wine", "quick_script", "steam_script"]);

new SteamScript()
    .name("Warface")
    .editor("Crytek")
    .author("ImperatorS79")
    .appId(291480)
    .wineVersion(LATEST_STAGING_VERSION)
    .wineDistribution("staging")
    .postInstall(function (wine/*, wizard*/) {
        wine.enableCSMT();
    })
    .go();
