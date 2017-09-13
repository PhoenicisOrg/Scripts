include(["Engines", "Wine", "QuickScript", "SteamScript"]);

new SteamScript()
    .name("The Vanishing of Ethan Carter Redux")
    .editor("The Astronauts")
    .author("Plata")
    .appId(400430)
    .wineVersion(LATEST_STAGING_VERSION)
    .wineDistribution("staging")
    .wineArchitecture("amd64")
    .go();
