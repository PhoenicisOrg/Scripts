include(["engines", "wine", "quick_script", "online_installer_script"]);

var installerImplementation = {
    run: function () {
        new OnlineInstallerScript()
            .name("7-zip")
            .editor("Igor Pavlov")
            .applicationHomepage("http://www.7-zip.org/")
            .author("ImperatorS79")
            .url("https://www.7-zip.org/a/7z1801.exe")
            .checksum("d56bca4973b1d1aa5915c41dce318b077ce8b5b2")
            .category("Accessories")
            .executable("7zFM.exe")
            .go();
    }
};

/* exported Installer */
var Installer = Java.extend(org.phoenicis.scripts.Installer, installerImplementation);
