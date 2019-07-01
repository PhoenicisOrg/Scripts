include("engines.wine.engine.object");

/**
 * Tool to kill running Wine processes
 */
// eslint-disable-next-line no-unused-vars
class KillWineProcessesTool {
    constructor() {
        // do nothing
    }

    run(container) {
        new Wine()
            .prefix(container)
            .kill()
    }
}
