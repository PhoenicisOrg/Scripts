include(["engines", "wine", "engine", "object"]);
include(["utils", "functions", "net", "resource"]);
include(["engines", "wine", "verbs", "luna"]);
include(["utils", "functions", "filesystem", "files"]);
include(["engines", "wine", "verbs", "dotnet452"]);

/**
* Verb to install .NET 4.6.1
* @returns {Wine} Wine object
*/
Wine.prototype.dotnet461 = function () {
    var OSVersion = this.windowsVersion();
    var setupFile = new Resource()
        .wizard(this._wizard)
        .url("https://download.microsoft.com/download/E/4/1/E4173890-A24A-4936-9FC9-AF930FE3FA40/NDP461-KB3102436-x86-x64-AllOS-ENU.exe")
        .checksum("864056903748706e251fec9f5d887ef9")
        .name("NDP461-KB3102436-x86-x64-AllOS-ENU.exe")
        .get();

    this.uninstall("Mono");

    this.wizard().wait(tr("Please wait ..."));
    this.run("reg", ["delete", "HKLM\Software\Microsoft\NET Framework Setup\NDP\v4", "/f"], null, false, true);

    remove(this.system32directory() + "/mscoree.dll");
    this.dotnet452()
    this.windowsVersion("win7");

    this.overrideDLL()
        .set("builtin", ["fusion"])
        .do();

    this.wizard().wait(tr("Please wait while {0} is installed ...", ".NET Framework 4.6.1"));
    this.run(setupFile, [setupFile, "/q", "/c:\"install.exe /q\""], null, false, true);

    this.overrideDLL()
        .set("native", ["mscoree"])
        .do();

    this.windowsVersion(OSVersion);

    if (OSVersion != "win2003") {
        print(tr("{0} applications can have issues when windows version is not set to \"win2003\"", ".NET 4.6.1"));
    }
    return this;
};
