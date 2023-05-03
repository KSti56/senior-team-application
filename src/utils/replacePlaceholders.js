/**
 * @author ThisLightMan <light@corebot.dev>
 * @file Replaces placeholders in a string with the given values
 * @module utils/replacePlaceholders
 */

/**
 * Replaces placeholders in a string with the given values
 * @param {string} string The string to replace placeholders in
 * @param {array|object[]} placeholders The placeholders to replace
 * @returns {string} The string with placeholders replaced
 */
module.exports = (string, placeholders) => {
    for (const placeholder of placeholders) {
        if (Array.isArray(placeholder)) {
            string = string.replace(new RegExp(`{${placeholder[0]}}`, 'gi'), placeholder[1])
        } else string = string.replace(new RegExp(`{${placeholder.name}}`, 'gi'), placeholder.value)
    }

    return string
}
