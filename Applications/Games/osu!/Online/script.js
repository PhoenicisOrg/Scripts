include("engines.wine.quick_script.online_installer_script");
include("engines.wine.verbs.dotnet45");
include("engines.wine.verbs.corefonts");

var installerImplementation = {
    run: function () {
        new OnlineInstallerScript()
            .name("osu!")
            .editor("Dean « peppy » Herbert")
            .applicationHomepage("https://osu.ppy.sh/")
            .author("ImperatorS79")
            .category("Games")
            .executable("osu!.exe")
            .wineVersion(LATEST_DEVELOPMENT_VERSION)
            .url("https://m1.ppy.sh/r/osu!install.exe")
            .preInstall(function (wine/*, wizard*/) {
                //maybe needs cjkfonts or set sound driver to alsa
                wine.corefonts();
                wine.dotnet45();
            })
            .go();
    }
};

/* exported Installer */
var Installer = Java.extend(org.phoenicis.scripts.Installer, installerImplementation);
