include(["engines", "wine", "quick_script", "zip_script"]);

var installerImplementation = {
    run: function () {
        new ZipScript()
            .name("Crayon Physics")
            .editor("Kloonigames")
            .applicationHomepage("http://www.kloonigames.com")
            .author("Quentin PÂRIS")
            .url("http://www.kloonigames.com/download/crayon.zip")
            .checksum("4561230bb4a6c7cd1188884a01f2adbf733c5233")
            .category("Games")
            .executable("crayon.exe")
            .go();
    }
};

/* exported Installer */
var Installer = Java.extend(org.phoenicis.scripts.Installer, installerImplementation);
