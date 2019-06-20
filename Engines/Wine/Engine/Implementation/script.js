include("utils.functions.filesystem.files");
include("utils.functions.filesystem.extract");
include("utils.functions.net.download");
include("utils.functions.net.resource");

/* exported WINE_PREFIX_DIR */
var WINE_PREFIX_DIR = "wineprefix";

/**
 * Wine engine
*/
class WineEngine {
    constructor() {
        this._configFactory = Bean("compatibleConfigFileFormatFactory");
        this._containerRegex = /[^a-z0-9_\- ]/gi;
        this._ExeAnalyser = Bean("exeAnalyser");
        this._ldPath = Bean("propertyReader").getProperty("application.environment.ld");
        this._operatingSystemFetcher = Bean("operatingSystemFetcher");
        this._wineEnginesDirectory = Bean("propertyReader").getProperty("application.user.engines") + "/wine";
        this._winePrefixesDirectory = Bean("propertyReader").getProperty("application.user.containers") + "/" + WINE_PREFIX_DIR + "/";
        this._wineWebServiceUrl = Bean("propertyReader").getProperty("webservice.wine.url");
        this._wizard = null;
        this._workingContainer = "";
    }

    getLocalDirectory(subCategory, version) {
        var parts = subCategory.split("-");
        var distribution = parts[0];
        var architecture = parts[2];
        var operatingSystem = this._operatingSystemFetcher.fetchCurrentOperationSystem().getWinePackage();
        var fullDistributionName = distribution + "-" + operatingSystem + "-" + architecture;
        return this._wineEnginesDirectory + "/" + fullDistributionName + "/" + version;
    }
    isInstalled(subCategory, version) {
        return fileExists(this.getLocalDirectory(subCategory, version));
    }
    install(subCategory, version) {
        this._installRuntime(this.getWizard());
        var parts = subCategory.split("-");
        var distribution = parts[0];
        var architecture = parts[2];
        var localDirectory = this.getLocalDirectory(subCategory, version);
        // if not installed
        if (!this.isInstalled(subCategory, version)) {
            var ownWizard = false;
            var wizard = this.getWizard();
            if (!wizard) {
                wizard = SetupWizard(InstallationType.ENGINES, "Wine " + version + " " + distribution + " (" + architecture + ")", java.util.Optional.empty());
                ownWizard = true;
            }

            print(tr("Installing version: {0}", version));

            var wineJson = JSON.parse(this.getAvailableVersions());

            var that = this;
            wineJson.forEach(function (distribution) {
                if (distribution.name === subCategory) {
                    distribution.packages.forEach(function (winePackage) {
                        if (winePackage.version === version) {
                            that._installWinePackage(wizard, winePackage, localDirectory);
                            that._installGecko(wizard, winePackage, localDirectory);
                            that._installMono(wizard, winePackage, localDirectory);
                        }
                    });
                }
            });

            // FIXME : Not found case!

            if (ownWizard) {
                wizard.close();
            }
        }
    }
    _installWinePackage(setupWizard, winePackage, localDirectory) {
        var tmpFile = createTempFile("tar.gz");

        new Downloader()
            .wizard(setupWizard)
            .url(winePackage.url)
            .checksum(winePackage.sha1sum)
            .to(tmpFile)
            .get();

        new Extractor()
            .wizard(setupWizard)
            .archive(tmpFile)
            .to(localDirectory)
            .extract();

        var files = ls(localDirectory);
        if (files.length == 1) {
            // probably the archive contained a folder (e.g. for Lutris Wine version)
            // link folders so Phoenicis can find them
            var extractedDir = files[0];

            var forEach = Array.prototype.forEach;
            forEach.call(ls(localDirectory + "/" + extractedDir), function (folder) {
                lns(localDirectory + "/" + extractedDir + "/" + folder, localDirectory + "/" + folder);
            }
            );
        }
    }
    _installRuntime(setupWizard) {
        var runtimeJsonPath = this._wineEnginesDirectory + "/runtime.json";
        var runtimeJson;
        var runtimeJsonFile;
        var download = false;
        var name;
        if (!fileExists(runtimeJsonPath)) {
            mkdir(this._wineEnginesDirectory + "/runtime");
            runtimeJsonFile = new Downloader()
                .wizard(this._wizard)
                .message(tr("Downloading runtime json..."))
                .url("https://phoenicis.playonlinux.com/index.php/runtime?os=linux")
                .to(runtimeJsonPath)
                .get();

            runtimeJson = JSON.parse(cat(runtimeJsonFile));
            download = true;

            var maxVersion = 0;
            runtimeJson.forEach(function (archive) {
                if (archive.arch == "amd64") {
                    if (archive.name > maxVersion) {
                        maxVersion = archive.name;
                    }
                }
            });

            name = maxVersion;
        }
        else {
            var oldRuntimeJsonFile = cat(this._wineEnginesDirectory + "/runtime.json");
            var oldRuntimeJson = JSON.parse(oldRuntimeJsonFile);

            runtimeJsonFile = new Downloader()
                .wizard(this._wizard)
                .message(tr("Downloading runtime json..."))
                .url("https://phoenicis.playonlinux.com/index.php/runtime?os=linux")
                .to(runtimeJsonPath)
                .get();

            runtimeJson = JSON.parse(cat(runtimeJsonFile));

            var maxVersion2 = 0;

            runtimeJson.forEach(function (archive) {
                if (archive.arch == "amd64") {
                    if (archive.name > maxVersion2) {
                        maxVersion2 = archive.name;
                    }
                }
            });

            var oldMaxVersion = 0;

            oldRuntimeJson.forEach(function (archive) {
                if (archive.arch == "amd64") {
                    if (archive.name > oldMaxVersion) {
                        oldMaxVersion = archive.name;
                    }
                }
            });

            if (maxVersion2 > oldMaxVersion) {
                name = maxVersion2;
                download = true;
            }

        }

        if (download == true) {
            remove(this._wineEnginesDirectory + "/runtime/lib");
            remove(this._wineEnginesDirectory + "/runtime/lib64");
            mkdir(this._wineEnginesDirectory + "/TMP");
            var that = this;
            runtimeJson.forEach(function (archive) {
                var runtime;
                if (archive.name == name) {
                    if (archive.arch == "x86") {
                        runtime = new Downloader()
                            .wizard(setupWizard)
                            .url(archive.url)
                            .message(tr("Downloading x86 runtime..."))
                            .checksum(archive.sha1sum)
                            .to(that._wineEnginesDirectory + "/TMP/" + archive.url.substring(archive.url.lastIndexOf('/') + 1))
                            .get();

                        new Extractor()
                            .wizard(setupWizard)
                            .archive(runtime)
                            .to(that._wineEnginesDirectory + "/runtime")
                            .extract();
                    }
                    else {
                        runtime = new Downloader()
                            .wizard(setupWizard)
                            .url(archive.url)
                            .message(tr("Downloading amd64 runtime..."))
                            .checksum(archive.sha1sum)
                            .to(that._wineEnginesDirectory + "/TMP/" + archive.url.substring(archive.url.lastIndexOf('/') + 1))
                            .get();

                        new Extractor()
                            .wizard(setupWizard)
                            .archive(runtime)
                            .to(that._wineEnginesDirectory + "/runtime")
                            .extract();
                    }
                }
            });
            remove(this._wineEnginesDirectory + "/TMP");
        }
    }

    _installGecko(setupWizard, winePackage, localDirectory) {
        if (winePackage.geckoUrl) {
            var gecko = new Resource()
                .wizard(setupWizard)
                .url(winePackage.geckoUrl)
                .checksum(winePackage.geckoMd5)
                .algorithm("md5")
                .name(winePackage.geckoFile)
                .directory("gecko")
                .get();

            var wineGeckoDir = localDirectory + "/share/wine/gecko";

            var FileClass = Java.type('java.io.File');
            lns(new FileClass(gecko).getParent(), wineGeckoDir);
        }
    }

    _installMono(setupWizard, winePackage, localDirectory) {
        if (winePackage.monoUrl) {
            var mono = new Resource()
                .wizard(setupWizard)
                .url(winePackage.monoUrl)
                .checksum(winePackage.monoMd5)
                .algorithm("md5")
                .name(winePackage.monoFile)
                .directory("mono")
                .get();

            var wineMonoDir = localDirectory + "/share/wine/mono";

            var FileClass = Java.type('java.io.File');
            lns(new FileClass(mono).getParent(), wineMonoDir);
        }
    }

    delete(subCategory, version) {
        if (this.isInstalled(subCategory, version)) {
            remove(this.getLocalDirectory(subCategory, version));
        }
    }

    getAvailableVersions() {
        var versionsFile = this._wineEnginesDirectory + "/availableVersions.json";
        touch(versionsFile);
        new Downloader()
            .wizard(this._wizard)
            .message(tr("Fetching available Wine versions..."))
            .url(this._wineWebServiceUrl)
            .to(versionsFile)
            .onlyIfUpdateAvailable(true)
            .get();
        return cat(versionsFile);
    }

    getWorkingContainer() {
        return this._workingContainer;
    }

    setWorkingContainer(workingContainer) {
        var workingContainerCleaned = workingContainer.replace(this._containerRegex, '');
        this._workingContainer = workingContainerCleaned;
    }

    getContainerDirectory(containerName) {
        var containerNameCleaned = containerName.replace(this._containerRegex, '');
        return this._winePrefixesDirectory + "/" + containerNameCleaned + "/";
    }

    createContainer(subCategory, version, containerName) {
        var parts = subCategory.split("-");
        var distribution = parts[0];
        var architecture = parts[2];

        var containerNameCleaned = containerName.replace(this._containerRegex, '');
        var containerDirectory = this._winePrefixesDirectory + "/" + containerNameCleaned + "/";

        mkdir(containerDirectory);

        var containerConfiguration = this._configFactory.open(containerDirectory + "/phoenicis.cfg");

        containerConfiguration.writeValue("wineVersion", version);
        containerConfiguration.writeValue("wineDistribution", distribution);
        containerConfiguration.writeValue("wineArchitecture", architecture);
    }

    run(executable, args, workingDir, captureOutput, wait, userData) {
        var subCategory = "";
        var version = "";
        var architecture = "";
        var workingContainerDirectory = this.getContainerDirectory(this.getWorkingContainer());
        if (fileExists(workingContainerDirectory)) {
            var containerConfiguration = this._configFactory.open(workingContainerDirectory + "/phoenicis.cfg");
            var distribution = containerConfiguration.readValue("wineDistribution", "upstream");
            architecture = containerConfiguration.readValue("wineArchitecture", "x86");
            var operatingSystem = this._operatingSystemFetcher.fetchCurrentOperationSystem().getWinePackage();
            subCategory = distribution + "-" + operatingSystem + "-" + architecture;
            version = containerConfiguration.readValue("wineVersion");
            this.install(subCategory, version);
        }
        else {
            print("Wine prefix \"" + this.getWorkingContainer() + "\" does not exist!");
            return "";
        }

        if (!args) {
            args = [];
        }

        var extensionFile = executable.split(".").pop();

        if (extensionFile == "msi") {
            var msiArgs = org.apache.commons.lang.ArrayUtils.addAll(["/i", executable], args);
            return this.run("msiexec", msiArgs, workingDir, captureOutput, wait, userData);
        }

        if (extensionFile == "bat") {
            var batArgs = org.apache.commons.lang.ArrayUtils.addAll(["/Unix", executable], args);
            return this.run("start", batArgs, workingDir, captureOutput, wait, userData);
        }

        // do not run 64bit executable in 32bit prefix
        if (extensionFile == "exe") {
            var FileClass = Java.type('java.io.File');
            if (architecture == "x86" && this._ExeAnalyser.is64Bits(new FileClass(executable))) {
                throw tr("Cannot run 64bit executable in a 32bit Wine prefix.");
            }
        }

        this.install(subCategory, version);

        var wineBinary = this.getLocalDirectory(subCategory, version) + "/bin/wine";
        var StringArray = Java.type('java.lang.String[]');
        var command = new StringArray(2 + args.length);
        command[0] = wineBinary;
        command[1] = executable;
        java.lang.System.arraycopy(args, 0, command, 2, args.length);
        var ProcessBuilderClass = Java.type('java.lang.ProcessBuilder');
        var processBuilder = new ProcessBuilderClass(command);

        var FileClass = Java.type('java.io.File');
        if (workingDir) {
            processBuilder.directory(new FileClass(workingDir));
        } else {
            var driveC = workingContainerDirectory + "/drive_c";
            mkdir(driveC);
            processBuilder.directory(new FileClass(driveC));
        }

        var environment = processBuilder.environment();
        // disable winemenubuilder (we manage our own shortcuts)
        environment.put("WINEDLLOVERRIDES", "winemenubuilder.exe=d");
        environment.put("WINEPREFIX", workingContainerDirectory);

        if (userData.wineDebug) {
            environment.put("WINEDEBUG", userData.wineDebug);
        }

        var ldPath = this._ldPath;
        if (userData.ldPath) {
            ldPath = userData.ldPath + ldPath;
        }
        if (architecture == "amd64") {
            ldPath = this._wineEnginesDirectory + "/runtime/lib64/:" + this._wineEnginesDirectory + "/runtime/lib/:"
                + this.getLocalDirectory(subCategory, version) + "/lib64/:"
                + this.getLocalDirectory(subCategory, version) + "/lib/:" + ldPath;
        } else {
            ldPath = this._wineEnginesDirectory + "/runtime/lib/:" + this.getLocalDirectory(subCategory, version) + "/lib/:" + ldPath;
        }
        environment.put("LD_LIBRARY_PATH", ldPath);

        if (this._operatingSystemFetcher.fetchCurrentOperationSystem().getWinePackage() === "darwin") {
            environment.put("DYLD_FALLBACK_LIBRARY_PATH", ldPath);
            environment.put("FREETYPE_PROPERTIES", "truetype:interpreter-version=35");
        }

        if (!captureOutput) {
            processBuilder.redirectErrorStream(true);
            processBuilder.redirectOutput(new FileClass(workingContainerDirectory + "/wine.log"));
        }

        var process = processBuilder.start();

        if (wait) {
            process.waitFor();
        }

        if (captureOutput) {
            return org.apache.commons.io.IOUtils.toString(process.getInputStream());
        } else {
            return "";
        }
    }

    changeVersion(containerName) {
        var wizard = SetupWizard(InstallationType.ENGINES, "Change " + containerName + " container wine version", java.util.Optional.empty());
        this._wizard = wizard;

        var containerNameCleaned = containerName.replace(this._containerRegex, '');
        var containerDirectory = this._winePrefixesDirectory + "/" + containerNameCleaned + "/";
        var containerConfiguration = this._configFactory.open(containerDirectory + "/phoenicis.cfg");

        var architecture = containerConfiguration.readValue("wineArchitecture", "x86");
        var operatingSystem = this._operatingSystemFetcher.fetchCurrentOperationSystem().getWinePackage();

        var wineJson = JSON.parse(this.getAvailableVersions());
        var distributions = new Array();
        var versions = new Array();
        wineJson.forEach(function (subPart) {
            var parts = subPart.name.split("-");
            if (parts[2] == architecture) {
                distributions.push(parts[0]);
                versions.push(new Array());
                subPart.packages.forEach(function (winePackage) {
                    versions[distributions.length - 1].push(winePackage.version);
                });
            }
        });

        var selectedDistribution = wizard.menu(tr("Please select the distribution of wine."), distributions);
        var selectedVersion = wizard.menu(tr("Please select the version of wine."), versions[distributions.indexOf(selectedDistribution.text)].sort());
        var subCategory = selectedDistribution.text + "-" + operatingSystem + "-" + architecture;

        this.install(subCategory, selectedVersion.text);

        containerConfiguration.writeValue("wineVersion", selectedVersion.text);
        containerConfiguration.writeValue("wineDistribution", selectedDistribution.text);
        containerConfiguration.writeValue("wineArchitecture", architecture);
        wizard.close();
    }

    getWizard() {
        return this._wizard;
    }

    setWizard(wizard) {
        this._wizard = wizard;
    }
}
