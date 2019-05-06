include("engines.wine.quick_script.zip_script");
include("engines.wine.plugins.regedit");

var installerImplementation = {
    run: function () {
        new ZipScript()
            .name("Road Rash")
            .editor("")
            .applicationHomepage("")
            .author("Quentin PÂRIS")
            .url("http://www.bestoldgames.net/download/bgames/road-rash.zip")
            .checksum("82f99038b86bbd267c64f2d34f30b3209bbe4daa")
            .category("Games")
            .executable("RASHME.EXE")
            .postInstall(function (wine/*, wizard*/) {
                var registryFile = Bean("fileSearcher").search(wine.prefixDirectory(), "RASH.REG")
                wine.regedit().open(registryFile[0]);
            })
            .go();
    }
};

/* exported Installer */
var Installer = Java.extend(org.phoenicis.scripts.Installer, installerImplementation);
