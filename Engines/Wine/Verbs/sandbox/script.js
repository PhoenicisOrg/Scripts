include("engines.wine.engine.object");
include("utils.functions.net.resource");

/**
* Verb to install a sandbox
* @returns {Wine} Wine object
*/
Wine.prototype.sandbox = function () {
    var tmp = Bean("propertyReader").getProperty("application.user.tmp");
    var resources = Bean("propertyReader").getProperty("application.user.resources");

    remove(this.prefixDirectory() + "/dosdevices/z:");
    remove(this.prefixDirectory() + "/dosdevices/y:");

    lns(tmp, this.prefixDirectory() + "/dosdevices/z:");
    lns(resources, this.prefixDirectory() + "/dosdevices/y:");

    return this;
};

/**
 * Verb to install a sandbox
*/
var verbImplementation = {
    install: function (container) {
        var wine = new Wine();
        wine.prefix(container);
        var wizard = SetupWizard(InstallationType.VERBS, "sandbox", java.util.Optional.empty());
        wine.wizard(wizard);
        wine.sandbox();
        wizard.close();
    }
};

/* exported Verb */
var Verb = Java.extend(org.phoenicis.engines.Verb, verbImplementation);

