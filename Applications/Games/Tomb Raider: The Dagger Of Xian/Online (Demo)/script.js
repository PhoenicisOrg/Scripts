include("engines.wine.quick_script.online_installer_script");

var installerImplementation = {
    run: function () {
        new OnlineInstallerScript()
            .name("Tomb Raider: The Dagger Of Xian (Demo)")
            .editor("Nicobass")
            .applicationHomepage("http://tombraider-dox.com/")
            .author("Plata")
            .url("http://tr.soja.pw/setup-x86-TombRaider-DOX-Demo.exe")
            .checksum("3d35b0a0ecd5cdf58ffb2f786158369befbd3f12")
            .category("Games")
            .executable("TombRaiderDOX.exe")
            .wineVersion(LATEST_STAGING_VERSION)
            .wineDistribution("staging")
            .go();
    }
};

/* exported Installer */
var Installer = Java.extend(org.phoenicis.scripts.Installer, installerImplementation);
