include(["engines", "wine", "quick_script", "steam_script"]);
include(["engines", "wine", "plugins", "csmt"]);
include(["engines", "wine", "plugins", "directdraw_renderer"]);
include(["engines", "wine", "plugins", "glsl"]);
include(["engines", "wine", "plugins", "opengl_version"]);
include(["utils", "functions", "filesystem", "files"]);

var installerImplementation = {
    run: function () {
        new SteamScript()
            .name("The Witcher 3: Wild Hunt")
            .editor("CD Projekt Red")
            .author("ImperatorS79")
            .wineVersion(LATEST_STAGING_VERSION)
            .wineDistribution("staging")
        //it would be better with dark ground fix -> https://bugs.winehq.org/attachment.cgi?id=58842&action=diff&context=patch&collapsed=&headers=1&format=raw
            .wineArchitecture("amd64")
            .appId(292030)
            .preInstall(function (wine/*, wizard*/) {
                //Ensure Directx11 full features will work, and CSMT for performance
                wine.setVersionGL(4, 5);
                wine.enableCSMT();
                wine.UseGLSL("enabled");
                wine.DirectDrawRenderer("opengl");
            })
            .go();
    }
};

/* exported Installer */
var Installer = Java.extend(org.phoenicis.scripts.Installer, installerImplementation);
