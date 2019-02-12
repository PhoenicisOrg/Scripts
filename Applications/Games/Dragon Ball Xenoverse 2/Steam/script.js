include(["engines", "wine", "quick_script", "steam_script"]);
include(["engines", "wine", "plugins", "csmt"]);

var installerImplementation = {
    run: function () {
        new SteamScript()
            .name("Dragon Ball Xenoverse 2")
            .editor("QLOC, DIMPS")
            .author("ImperatorS79")
            .wineVersion(LATEST_STAGING_VERSION)
            .wineDistribution("staging")
            .wineArchitecture("amd64")
            .appId(454650)
            .preInstall(function (wine/*, wizard*/) {
                wine.enableCSMT();
                //might need dxfullsetup d3d11 and d3d_43 compiler, but test result is old (2.10)
            })
            .go();
    }
};

/* exported Installer */
var Installer = Java.extend(org.phoenicis.scripts.Installer, installerImplementation);
