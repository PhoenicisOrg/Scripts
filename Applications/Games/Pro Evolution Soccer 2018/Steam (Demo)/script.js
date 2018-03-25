include(["Engines", "Wine", "QuickScript", "SteamScript"]);

new SteamScript()
    .name("Pro Evolution Soccer 2018 (Demo)")
    .editor("Konami Digital Entertainment Co., Ltd.")
    .author("Plata")
    .appId(592590)
    .wineVersion(LATEST_STAGING_VERSION)
    .wineDistribution("staging")
    .wineArchitecture("amd64")
    .go();
