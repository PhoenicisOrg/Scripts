include(["engines", "wine", "quick_script", "steam_script"]);
include(["engines", "wine", "verbs", "vcrun2010"]);
include(["engines", "wine", "verbs", "dotnet40"]);
include(["engines", "wine", "verbs", "d3dx9"]);

var installerImplementation = {
    run: function () {
        new SteamScript()
            .name("Space Colony")
            .editor("Firefly Studios")
            .author("Zemogiter")
            .wineDistribution("upstream")
            .wineVersion(LATEST_DEVELOPMENT_VERSION)
            .appId(297920)
            .preInstall(function (wine) {
                wine.vcrun2010();
                wine.dotnet40();
                wine.d3dx9();
            })
            .go();
    }
};


/* exported Installer */
var Installer = Java.extend(org.phoenicis.scripts.Installer, installerImplementation);
