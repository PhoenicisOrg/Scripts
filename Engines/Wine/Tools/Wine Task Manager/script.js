const Wine = include("engines.wine.engine.object");
const {LATEST_STABLE_VERSION, LATEST_DEVELOPMENT_VERSION, LATEST_STAGING_VERSION, LATEST_DOS_SUPPORT_VERSION} = include("engines.wine.engine.versions");

/**
 * Tool to open the Wine task manager
 */
// eslint-disable-next-line no-unused-vars
module.default = class WineTaskManagerTool {
    constructor() {
        // do nothing
    }

    run(container) {
        new Wine()
            .prefix(container)
            .run("taskmgr", [], null, false, true);
    }
}
