include(["Engines", "Wine", "QuickScript", "OnlineInstallerScript"]);

new OnlineInstallerScript()
    .name("Uplay")
    .editor("Ubisoft")
    .applicationHomepage("https://uplay.ubi.com/")
    .author("Plata")
    .url("https://ubistatic3-a.akamaihd.net/orbit/launcher_installer/UplayInstaller.exe")
    .category("Games")
    .executable("UbisoftGameLauncher.exe")
    .wineVersion(LATEST_STAGING_VERSION)
    .wineDistribution("staging")
    .go();
