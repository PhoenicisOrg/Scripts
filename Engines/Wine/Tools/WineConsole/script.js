include("engines.wine.engine.object");

/**
 * Tool to open a Wine console
 */
// eslint-disable-next-line no-unused-vars
class WineConsoleTool {
    constructor() {
        // do nothing
    }

    run(container) {
        new Wine()
            .prefix(container)
            .run("wineconsole", [], null, false, true);
    }
}
