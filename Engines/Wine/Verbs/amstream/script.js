include(["engines", "wine", "engine", "object"]);
include(["engines", "wine", "plugins", "override_dll"]);
include(["utils", "functions", "net", "resource"]);
include(["engines", "wine", "verbs", "luna"]);
include(["utils", "functions", "filesystem", "files"]);
include(["utils", "functions", "filesystem", "extract"]);
include(["engines", "wine", "plugins", "regsvr32"]);


/**
* Verb to install amstream
* @returns {Wine} Wine object
*/
Wine.prototype.amstream = function () {
    var setupFile = new Resource()
        .wizard(this.wizard())
        .url("https://download.microsoft.com/download/0/A/F/0AFB5316-3062-494A-AB78-7FB0D4461357/windows6.1-KB976932-X86.exe")
        .checksum("c3516bc5c9e69fee6d9ac4f981f5b95977a8a2fa")
        .name("windows6.1-KB976932-X86.exe")
        .get();
    this.wizard().wait(tr("Please wait while {0} is installed ...", "amstream"));
    remove(this.system32directory() + "/amstream.dll");
    new CabExtract()
        .archive(setupFile)
        .to(this.system32directory())
        .extract(["-L", "-F", "amstream.dll"]);
    this.regsvr32().install("amstream.dll");    
    if (this.architecture() == "amd64") {
        var setupFile = new Resource()
            .wizard(this.wizard())
            .url("https://download.microsoft.com/download/0/A/F/0AFB5316-3062-494A-AB78-7FB0D4461357/windows6.1-KB976932-X64.exe")
            .checksum("74865ef2562006e51d7f9333b4a8d45b7a749dab")
            .name("windows6.1-KB976932-X64.exe")
            .get();
       this.wizard().wait(tr("Please wait while {0} is installed ...", "amstream"));
       remove(this.system64directory() + "/amstream.dll");
       new CabExtract()
            .archive(setupFile)
            .to(this.system64directory())
            .extract(["-L", "-F", "amd64_microsoft-windows-directshow-other_31bf3856ad364e35_6.1.7601.17514_none_6b778d68f75a1a54/amstream.dll"]);
       this.regsvr64().install("amstream.dll");
    }
    this.overrideDLL()
        .set("native,builtin", ["amstream"])
        .do();

    return this;
};
