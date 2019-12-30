const Wine = include("engines.wine.engine.object");
const { Extractor } = include("utils.functions.filesystem.extract");
const { cp, remove } = include("utils.functions.filesystem.files");
const operatingSystemFetcher = Bean("operatingSystemFetcher");
const Optional = Java.type("java.util.Optional");
const OverrideDLL = include("engines.wine.plugins.override_dll");
const { GitHubReleaseDownloader } = include("utils.functions.net.githubreleases");
const { cp, remove } = include("utils.functions.filesystem.files");

/**
 * Verb to install VK9
 * see: https://github.com/disks86/VK9
 */
class VK9 {
    constructor(wine) {
        this.wine = wine;
    }

    /**
     * Sets the VK9 version to install
     *
     * @param {string} vk9Version The VK9 version to install
     * @returns {VK9} The VK9 object
     */
    withVersion(vk9Version) {
        this.vk9Version = vk9Version;

        return this;
    }

    go() {
        const wizard = this.wine.wizard();
        const prefixDirectory = this.wine.prefixDirectory();
        const system32directory = this.wine.system32directory();
        const system64directory = this.wine.system64directory();

        if (operatingSystemFetcher.fetchCurrentOperationSystem().getFullName() !== "Linux") {
            const question = tr("VK9 is currently unsupported on non-Linux operating systems due to MoltenVK implementation being incomplete. Select how do you want to approach this situation.")
            const choices = [
                tr("YES, continue with VK9 installation regardless"),
                tr("NO, quit script alltogether"),
                tr("Exit VK9 Installer, but continue with the script")
            ];

            const answer = wizard.menu(question, choices);

            switch (answer.index) {
                case 1:
                    // choice: "NO, quit script alltogether"
                    throw new Error("User aborted the script.");
                case 2:
                    // choice: "Exit VK9 Installer, but continue with the script"
                    return this;
                default:
                // do nothing
            }
        }

        print("NOTE: wine version should be greater or equal to 3.5");
        print("NOTE: works from 0.28.0");

        const githubDownloader = new GitHubReleaseDownloader("disks86", "VK9", wizard);

        if (typeof this.vk9Version !== "string") {
            this.vk9Version = githubDownloader.getLatestRelease();
        }

        const [setupFile32] = githubDownloader.download(this.vk9Version, /(.+)-bin-x86-Release.zip/);

        new Extractor()
            .wizard(wizard)
            .archive(setupFile32)
            .to(`${prefixDirectory}/TMP32/`)
            .extract();

        cp(`${prefixDirectory}/TMP32/${this.vk9Version}-bin-x86-Release/d3d9.dll`, system32directory);

        remove(`${prefixDirectory}/TMP32/`);

        if (this.wine.architecture() === "amd64") {
            const [setupFile64] = githubDownloader.download(this.vk9Version, /(.+)-bin-x86_64-Release.zip/);

            new Extractor()
                .wizard(wizard)
                .archive(setupFile64)
                .to(`${prefixDirectory}/TMP64/`)
                .extract();

            cp(`${prefixDirectory}/TMP64/${this.vk9Version}-bin-x86_64-Release/d3d9.dll`, system64directory);

            remove(`${prefixDirectory}/TMP64/`);
        }

        new OverrideDLL(this.wine).withMode("native", ["d3d9"]).go();
    }

    static install(container) {
        const wine = new Wine();
        const wizard = SetupWizard(InstallationType.VERBS, "VK9", Optional.empty());

        wine.wizard(wizard);
        wine.prefix(container);

        const githubDownloader = new GitHubReleaseDownloader("disks86", "VK9", wizard);

        const versions = githubDownloader.getReleases();
        const latestVersion = githubDownloader.getLatestRelease();

        const selectedVersion = wizard.menu(tr("Please select the version."), versions, latestVersion);

        // install selected version
        new VK9(wine).withVersion(selectedVersion.text).go();

        wizard.close();
    }
}

module.default = VK9;
