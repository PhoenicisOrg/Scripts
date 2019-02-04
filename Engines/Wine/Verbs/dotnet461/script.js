include(["engines", "wine", "engine", "object"]);
include(["engines", "wine", "plugins", "override_dll"]);
include(["utils", "functions", "net", "resource"]);
include(["engines", "wine", "plugins", "windows_version"]);
include(["engines", "wine", "verbs", "dotnet46"]);

/**
* Verb to install .NET 4.6.1
* @returns {Wine} Wine object
*/
Wine.prototype.dotnet461 = function () {
    if (this.architecture() == "amd64") {
        print(tr("This package ({0}) may not fully work on a 64-bit installation. 32-bit prefixes may work better.", "dotnet461"));
    }

    var osVersion = this.windowsVersion();

    var setupFile = new Resource()
        .wizard(this._wizard)
        .url("https://download.microsoft.com/download/E/4/1/E4173890-A24A-4936-9FC9-AF930FE3FA40/NDP461-KB3102436-x86-x64-AllOS-ENU.exe")
        .checksum("83d048d171ff44a3cad9b422137656f585295866")
        .name("NDP461-KB3102436-x86-x64-AllOS-ENU.exe")
        .get();

    this.uninstall("Mono");

    this.dotnet46();
    this.windowsVersion("win7");

    this.overrideDLL()
        .set("builtin", ["fusion"])
        .do();

    this.wizard().wait(tr("Please wait while {0} is installed...", ".NET Framework 4.6.1"));
    this.run(setupFile, [setupFile, "/q", "/c:\"install.exe /q\""], null, false, true);

    this.wizard().wait(tr("Please wait..."));
    this.run("reg", ["delete", "HKCU\\Software\\Wine\\DllOverrides\\*fusion", "/f"], null, false, true);

    this.overrideDLL()
        .set("native", ["mscoree"])
        .do();

    this.windowsVersion(osVersion);

    return this;
};

/**
 * Verb to install .NET 4.6.1
*/
var verbImplementation = {
    install: function (container) {
        var wine = new Wine();
        wine.prefix(container);
        var wizard = SetupWizard(InstallationType.VERBS, "dotnet461", java.util.Optional.empty());
        wine.wizard(wizard);
        wine.dotnet461();
        wizard.close();
    }
};

/* exported Verb */
var Verb = Java.extend(org.phoenicis.engines.Verb, verbImplementation);
