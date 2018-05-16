include(["engines", "wine", "quick_script", "online_installer_script"]);
include(["engines", "wine", "plugins", "windows_version"]);

var installerImplementation = {
    run: function () {
        new OnlineInstallerScript()
            .name("Soundplant")
            .editor("Marcel Blum")
            .applicationHomepage("http://soundplant.org/")
            .author("ImperatorS79")
            .url("http://soundplant.org/downloads/Soundplant45_Win_setup.exe")
            .checksum("df17f942189618219cd504beee1be0712f4e4e4e")
            .category("Accessories")
            .executable("Soundplant45.exe")
            .preInstall(function (wine/*, wizard*/) {
                wine.windowsVersion("win7");
            })
            .go();
    }
};

/* exported Installer */
var Installer = Java.extend(org.phoenicis.scripts.Installer, installerImplementation);
