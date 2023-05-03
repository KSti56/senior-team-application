/**
 * @author ThisLightMan <light@corebot.dev>
 * @file Get a property from an object, case-insensitively
 * @module utils/getCaseInsensitiveProperty
 */

/**
 * Get a property from an object, case-insensitively
 * @param {object} object The object to get the property from
 * @param {string} property The property to get
 * @returns {any} The property value
 */
module.exports = (object, property) => {
    if (!object) return undefined

    const keys = Object.keys(object)
    const lowerCaseKeys = keys.map(key => key.toLowerCase())

    const index = lowerCaseKeys.indexOf(property.toLowerCase())

    if (index === -1) return undefined

    return object[keys[index]]
}
