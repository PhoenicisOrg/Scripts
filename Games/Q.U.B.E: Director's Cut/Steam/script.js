include(["Functions", "QuickScript", "SteamScript"]);
include(["Functions", "Verbs", "dotnet40"]);

new SteamScript()
    .name("QUBE: Director's Cut")
    .editor("Toxic Games")
    .author("Plata")
    .appId(239430)
    .preInstall(function(wine, wizard) {
        wine.dotnet40();
    })
    .go();
