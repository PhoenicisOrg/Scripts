include(["Engines", "Wine", "QuickScript", "LocalInstallerScript"]);
include(["Engines"," Wine", "Verbs", "d3dx9"]);
include(["Engines", "Wine", "Engine", "Object"]);
include(["Utils", "Functions", "Filesystem", "Files"]);

new LocalInstallerScript()
    .name("STAR WARS™ Empire at War: Gold Pack")                       
    .editor("Petroglyph")                               
    .author("ImperatorS79")                     
    .category("Games")                          
    .executable("LaunchEAW.exe")
    .preInstall(function (wine, wizard) {
        wine.d3dx9();
    })
    .postInstall(function (wine, wizard) {
        new Downloader()
            .wizard(wizard)
            .url("http://static.dolimg.com/mh_netstorage/lucasfilm/patches/pc/EAW_RAM_MPLobby_update.exe")
            .checksum("9fdecb9609a17f7358f2984a3278b484")
            .to(wine.prefixDirectory + "drive_c/users/Public/Documents/EAW_RAM_MPLobby_update.exe")
            .get();
        
        wine.runInsidePrefix(wine.prefixDirectory + "drive_c/users/Public/Documents/EAW_RAM_MPLobby_update.exe","");
    })
    .go(); 

