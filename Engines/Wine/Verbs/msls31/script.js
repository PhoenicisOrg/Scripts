include(["engines", "wine", "engine", "object"]);
include(["utils", "functions", "net", "resource"]);

/**
* Verb to install msls31.dll
* @returns {Wine} Wine object
*/
Wine.prototype.msls31 = function () {
    var setupFile = new Resource()
        .wizard(this.wizard())
        .url("ftp://ftp.hp.com/pub/softlib/software/msi/InstMsiW.exe")
        .checksum("4fc3bf0dc96b5cf5ab26430fac1c33c5c50bd142")
        .name("InstMsiW.exe")
        .get();

    remove(this.system32directory() + "/msls31.dll");

    new CabExtract()
        .archive(setupFile)
        .wizard(this.wizard())
        .to(this.system32directory())
        .extract(["-F", "msls31.dll"]);

    return this;
};
