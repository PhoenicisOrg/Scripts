include("engines.wine.engine.object");
include("engines.wine.plugins.regedit");

/**
 * Tool to open the Wine registry editor
 */
// eslint-disable-next-line no-unused-vars
class WineRegistryEditorTool {
    constructor() {
        // do nothing
    }

    run(container) {
        new Wine()
            .prefix(container)
            .run("regedit", [], null, false, true);
    }
}
