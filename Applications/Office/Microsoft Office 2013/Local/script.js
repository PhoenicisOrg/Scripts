include("engines.wine.quick_script.local_installer_script");
include("engines.wine.plugins.override_dll");

var installerImplementation = {
    run: function () {
        new LocalInstallerScript()
            .name("Microsoft Office 2013")
            .editor("Microsoft")
            .applicationHomepage("https://products.office.com/fr-be/microsoft-office-2013")
            .wineVersion(LATEST_STAGING_VERSION)
            .wineDistribution("staging")
            .author("ImperatorS79")
            .category("Office")
        // exe set with WineShorcut
            .postInstall(function (wine/*, wizard*/) {
                wine.overrideDLL()
                    .set("native, builtin", ["riched20"])
                    .do();

                new WineShortcut()
                    .name("Microsoft Word 2013")
                    .prefix("Microsoft Office 2013")
                    .search("WINWORD.EXE")
                    .miniature(["Office", "Microsoft Office 2013"])
                    .create();

                new WineShortcut()
                    .name("Microsoft Excel 2013")
                    .prefix("Microsoft Office 2013")
                    .search("EXCEL.EXE")
                    .miniature(["Office", "Microsoft Office 2013"])
                    .create();

                new WineShortcut()
                    .name("Microsoft PowerPoint 2013")
                    .prefix("Microsoft Office 2013")
                    .search("POWERPNT.EXE")
                    .miniature(["Office", "Microsoft Office 2013"])
                    .create();

                new WineShortcut()
                    .name("Microsoft OneNote 2013")
                    .prefix("Microsoft Office 2013")
                    .search("ONENOTE.EXE")
                    .miniature(["Office", "Microsoft Office 2013"])
                    .create();

                new WineShortcut()
                    .name("Microsoft Outlook 2013")
                    .prefix("Microsoft Office 2013")
                    .search("OUTLOOK.EXE")
                    .miniature(["Office", "Microsoft Office 2013"])
                    .create();
            })
            .go();
    }
};

/* exported Installer */
var Installer = Java.extend(org.phoenicis.scripts.Installer, installerImplementation);
