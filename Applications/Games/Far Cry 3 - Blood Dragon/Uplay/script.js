include(["engines", "wine", "quick_script", "uplay_script"]);

var installerImplementation = {
    run: function () {
        new UplayScript()
            .name("Far Cry 3 - Blood Dragon")
            .applicationHomepage("http://store.ubi.com/de/far-cry--3---blood-dragon/57062ebf88a7e316728b4626.html")
            .editor("Ubisoft Montreal")
            .author("Plata")
            .appId(205)
            .wineVersion(LATEST_STAGING_VERSION)
            .wineDistribution("staging")
            .go();
    }
};

/* exported Installer */
var Installer = Java.extend(org.phoenicis.scripts.Installer, installerImplementation);
