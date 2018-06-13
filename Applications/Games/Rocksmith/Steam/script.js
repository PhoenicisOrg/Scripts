include(["engines", "wine", "quick_script", "steam_script"]);
include(["engines", "wine", "plugins", "sound_driver"]);
include(["utils", "functions", "filesystem", "files"]);

function fixIni(ini) {
    var screenSize = java.awt.Toolkit.getDefaultToolkit().getScreenSize();
    var content = "[Audio]\n" +
        "EnableMicrophone=0\n" +
        "LatencyBuffer=4\n" +
        "ExclusiveMode=0\n" +
        "ForceWDM=0\n" +
        "ForceDirectXSink=0\n" +
        "DumpAudioLog=0\n" +
        "MaxOutputBufferSize=0\n" +
        "[Renderer.Win32]\n" +
        "ScreenWidth=" + screenSize.width + "\n" +
        "ScreenHeight=" + screenSize.height + "\n" +
        "MinScreenWidth=640\n" +
        "MinScreenHeight=480\n" +
        "Fullscreen=1\n" +
        "VisualQuality=8";
    writeToFile(ini, content);
}

var installerImplementation = {
    run: function () {
        new SteamScript()
            .name("Rocksmith™")
            .editor("Ubisoft - San Francisco")
            .author("Plata")
            .appId(205190)
            .postInstall(function (wine/*, wizard*/) {
                wine.setSoundDriver("alsa");
                wine.setOsForApplication().set("Rocksmith.exe", "win7").do();
                fixIni(wine.prefixDirectory() + "drive_c/" + wine.programFiles() + "/Steam/steamapps/common/Rocksmith/Rocksmith.ini");
            })
            .go();
    }
};

/* exported Installer */
var Installer = Java.extend(org.phoenicis.scripts.Installer, installerImplementation);
