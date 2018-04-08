include(["engines", "wine", "quick_script", "steam_script"]);
include(["Engines","Wine", "Verbs", "d3dx9"]);

new SteamScript()
    .name("STAR WARS™ Empire at War: Gold Pack")
    .editor("Petroglyph")
    .author("ImperatorS79")
    .appId(32470)
    .preInstall(function (wine/*, wizard*/) {
        wine.d3dx9();
    })
    .go();
