include(["engines", "wine", "engine", "object"]);

/**
 * Regedit support
 * @returns {Wine} Wine object
 */
Wine.prototype.regedit = function () {
    var _wine = this;

    this.open = function (args) {
        _wine.run("regedit", [args], this.prefixDirectory(), false, true);
        return _wine;
    };

    this.patch = function (patchContent) {
        if (patchContent.getClass().getCanonicalName() == "byte[]") {
            patchContent = new java.lang.String(patchContent);
        }
        var tmpFile = createTempFile("reg");
        writeToFile(tmpFile, patchContent);
        _wine.run("regedit", [tmpFile], this.prefixDirectory(), false, true);
        return _wine;
    };

    this.fetchValue = function (keyPath) {
        var root = keyPath[0];
        var registryFile;
        switch (root) {
            case "HKEY_CURRENT_USER":
                registryFile = "user.reg";
                break;
            case "HKEY_LOCAL_MACHINE":
                registryFile = "system.reg";
                break;
            default:
                throw "Illegal registry root exception";
        }

        keyPath.shift();

        var registryValue = Bean("registryParser").parseFile(new java.io.File(this.prefixDirectory() + "/" + registryFile), root).getChild(keyPath);

        if (registryValue == null) {
            return null;
        }

        if (registryValue.getText) {
            return registryValue.getText();
        } else {
            return registryValue;
        }
    };

    return this;
};

Wine.prototype.registry = Wine.prototype.regedit;