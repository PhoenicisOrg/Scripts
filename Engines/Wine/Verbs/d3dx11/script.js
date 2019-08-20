const Wine = include("engines.wine.engine.object");
const Resource = include("utils.functions.net.resource");
const { CabExtract } = include("utils.functions.filesystem.extract");

include("engines.wine.plugins.override_dll");

/**
 * Verb to install D3DX11
 *
 * @returns {Wine} Wine object
 */
Wine.prototype.d3dx11 = function () {
    const extractDirectXtoSystemDirectory = (progressBar, filesToExtract, destination, pattern) => {
        filesToExtract.reduce((numberOfExtractedFiles, cabFile) => {
            print(tr("Extracting {0}...", cabFile));

            progressBar.setText(tr("Extracting {0}...", "DirectX 11"));
            progressBar.setProgressPercentage((numberOfExtractedFiles * 100) / filesToExtract.length);

            new CabExtract()
                .archive(this.prefixDirectory() + "/drive_c/d3dx11/" + cabFile)
                .to(destination)
                .extract(["-L", "-F", pattern]);

            return numberOfExtractedFiles + 1;
        }, 0);
    };

    const setupFile = new Resource()
        .wizard(this.wizard())
        .url(
            "http://download.microsoft.com/download/8/4/A/84A35BF1-DAFE-4AE8-82AF-AD2AE20B6B14/directx_Jun2010_redist.exe"
        )
        .checksum("7c1fc2021cf57fed3c25c9b03cd0c31a")
        .algorithm("MD5")
        .name("directx_Jun2010_redist.exe")
        .get();

    const progressBar = this.wizard().progressBar(tr("Please wait..."));
    progressBar.setText(tr("Extracting {0}...", "DirectX 11"));
    progressBar.setProgressPercentage(0);

    new CabExtract()
        .archive(setupFile)
        .to(this.prefixDirectory() + "/drive_c/d3dx11/")
        .extract(["-L", "-F", "*d3dx11*x86*"]);

    const filesToExtractx86 = ["Aug2009_d3dx11_42_x86.cab", "Jun2010_d3dx11_43_x86.cab"];

    extractDirectXtoSystemDirectory(progressBar, filesToExtractx86, this.system32directory(), "*.dll");

    if (this.architecture() == "amd64") {
        new CabExtract()
            .archive(setupFile)
            .to(this.prefixDirectory() + "/drive_c/d3dx11/")
            .extract(["-L", "-F", "*d3dx11*x64*"]);

        const filesToExtractx64 = [
            "Aug2009_d3dx11_42_x86.cab",
            "Jun2010_d3dx11_43_x86.cab",
            "Aug2009_d3dx11_42_x64.cab",
            "Jun2010_d3dx11_43_x64.cab"
        ];

        extractDirectXtoSystemDirectory(progressBar, filesToExtractx64, this.system64directory(), "*.dll");
    }

    this.overrideDLL()
        .set("native, builtin", ["d3dx11_42", "d3dx11_43"])
        .do();

    return this;
};

/**
 * Verb to install D3DX11
 */
module.default = class D3DX11Verb {
    constructor() {
        // do nothing
    }

    install(container) {
        const wine = new Wine();

        wine.prefix(container);

        const wizard = SetupWizard(InstallationType.VERBS, "d3dx11", java.util.Optional.empty());

        wine.wizard(wizard);
        wine.d3dx11();

        wizard.close();
    }
};
