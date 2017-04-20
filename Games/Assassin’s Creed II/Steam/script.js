include(["Functions", "QuickScript", "SteamScript"]);

new SteamScript()
    .name("Assassin’s Creed II")
    .editor("Ubisoft Montreal")
    .author("Plata")
    .appId(33230)
    .wineVersion("2.5")
    .wineDistribution("staging")
    .postInstall(function(wine, wizard) {
        wine.setOsForApplication().set("UbisoftGameLauncher.exe", "vista").do();
    })
    .go();
