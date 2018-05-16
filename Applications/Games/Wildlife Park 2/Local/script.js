include(["engines", "wine", "quick_script", "local_installer_script"]);
include(["engines", "wine", "plugins", "virtual_desktop"]);
include(["engines", "wine", "verbs", "quartz"]);

var installerImplementation = {
    run: function () {
        new LocalInstallerScript()
            .name("Wildlife Park 2")
            .editor("B-Alive")
            .applicationHomepage("www.wildlifepark2.com")
            .author("Zemogiter")
            .category("Games")
            .executable("WLP2.exe")
            .preInstall(function (wine, wizard) {
                wizard.message(tr("On first run the game might not go into full screen. If that happens go to options and set the resolution to 1280x960. You will be asked to close the game in order to apply the new settings. Click Yes. Once you start the game again you should see a window where you can set your game resolution to match your screen."));
                wine.quartz();
                var screenSize = java.awt.Toolkit.getDefaultToolkit().getScreenSize();
                wine.setVirtualDesktop(screenSize.width, screenSize.height);
            })
            .go();
    }
};

/* exported Installer */
var Installer = Java.extend(org.phoenicis.scripts.Installer, installerImplementation);
