include(["engines", "wine", "quick_script", "zip_script"]);

var installerImplementation = {
    run: function () {
        new ZipScript()
            .name("Druid Soccer")
            .editor("Kloonigames")
            .applicationHomepage("http://www.kloonigames.com")
            .author("Quentin PÂRIS")
            .url("http://www.kloonigames.com/download.php?file=druid.zip")
            .checksum("75751e71dca60fb94d8d39b5f210384c435e4918")
            .category("Games")
            .executable("druid.exe")
            .go();
    }
};

/* exported Installer */
var Installer = Java.extend(org.phoenicis.scripts.Installer, installerImplementation);
