const screenManager = Bean("screenManager");

/**
 * Obtains the width of user's screen
 * @returns {number} width of user's screen in pixels
 */
function getScreenWidth() {
    return screenManager.getScreenWidth();
}

/**
 * Obtains the height of user's screen
 * @returns {number} height of user's screen in pixels
 */
function getScreenHeight() {
    return screenManager.getScreenHeight();
}

module.getScreenWidth = getScreenWidth;
module.getScreenHeight = getScreenHeight;
