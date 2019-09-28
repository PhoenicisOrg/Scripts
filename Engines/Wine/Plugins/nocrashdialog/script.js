const Regedit = include("engines.wine.plugins.regedit");

/**
 * Plugin to disable the crashdialog
 */
module.default = class NoCrashDialog {
    constructor(wine) {
        this.wine = wine;
    }

    go() {
        const regeditFileContent = `REGEDIT4\n\n[HKEY_CURRENT_USER\\Software\\Wine\\WineDbg]\n"ShowCrashDialog"="00000000"`;

        new Regedit(this.wine).patch(regeditFileContent);
    }
};
