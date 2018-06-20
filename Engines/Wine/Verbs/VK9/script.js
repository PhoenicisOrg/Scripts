include(["engines", "wine", "engine", "object"]);
include(["engines", "wine", "plugins", "override_dll"]);
include(["utils", "functions", "net", "resource"]);
include(["utils", "functions", "filesystem", "files"]);

/**
* Setup VK9-> https://github.com/disks86/VK9
* @returns {Wine} Wine object
*/
Wine.prototype.VK9 = function () {
    if (this.architecture() == "amd64") {
        throw "{0} cannot curreently be installed in a 64bit wine prefix.".format("VK9");
    }

    print("NOTE: you need a driver that supports Vulkan enough to run VK9");
    print("NOTE: wine version should be greater or equal to 3.5");
    print("NOTE: this is a debug dll");

    var vk9Version = "0.25.0";

    var setupFile32 = new Resource()
        .wizard(this.wizard())
        .url("https://github.com/disks86/VK9/releases/download/" + vk9Version +"/"+ vk9Version + "-bin-Release.zip")
        .checksum("9ec007090000c4923e502b0360b9ebfd304fbf05")
        .name(vk9Version + "-bin-Realease.zip")
        .get();

    new Extractor()
        .wizard(this.wizard())
        .archive(setupFile32)
        .to(this.prefixDirectory() + "/TMP32/")
        .extract();

    cp(this.prefixDirectory() + "/TMP32/D3d9.dll", this.system32directory());

    this.overrideDLL()
        .set("native", ["d3d9"])
        .do();

    var userFilePath = this.wizard().browse("Please select the .exe directory", this.prefixDirectory(), ["exe"]);
    print(userFilePath);

    // Need to copy VK9.conf and shader into executable directory
    // var executables = this._fileSearcher.search(_shortcutPrefixDirectory, this._search);

    remove(this.prefixDirectory() + "/TMP32/");

    return this;
}
