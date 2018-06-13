include(["engines", "wine", "quick_script", "online_installer_script"]);

var installerImplementation = {
    run: function () {
        new OnlineInstallerScript()
            .name("Photofiltre")
            .editor("Antonio Da Cruz")
            .applicationHomepage("http://photofiltre.free.fr")
            .author("Quentin PÂRIS")
            .url("http://photofiltre.free.fr/utils/pf-setup-fr-652.exe")
            .checksum("dc965875d698cd3f528423846f837d0dcf39616d")
            .category("Graphics")
            .executable("PhotoFiltre.exe")
            .go();
    }
};

/* exported Installer */
var Installer = Java.extend(org.phoenicis.scripts.Installer, installerImplementation);
