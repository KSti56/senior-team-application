/**
 * @author ThisLightMan <light@corebot.dev>
 * @file Event Handler
 * @module handlers/EventHandler
 */

const fs = require('fs')
const path = require('path')
const debug = require('debug')('event-handler')

const eventCache = []

const index = require('../')

/**
 * Finds and registers all event files in the specified directory
 * @param {string} directory The directory to load the events from
 * @returns {object[]} An array of event objects
 */
const getEvents = (directory = 'events') => {
    const directoryPath = path.join(__dirname, '../', directory)

    debug('Loading events from %s', directoryPath)

    const fileNames = fs.readdirSync(directoryPath)
        .filter(file => file.endsWith('.js'))

    debug('Found %d files', fileNames.length)

    const eventFiles = fileNames.map(file => {
        const eventPath = path.join(directoryPath, file)

        const eventName = file.split('.').shift()
        const eventFunction = require(eventPath)

        if (eventFunction instanceof Object) {
            debug('Found event %s', eventName)
            return {
                name: eventName,
                exec: eventFunction
            }
        } else {
            debug('Found non-event file %s', file)
            return null
        }
    })
        .filter(event => event)

    debug('Returned %d events', eventFiles.length)

    return eventFiles
}

/**
 * Registers an event
 * @param {object} event The event to register
 */
const registerEventListener = event => {
    debug('Registering event %s', event.name)

    index.client.on(event.name, event.exec)

    debug('Registered event %s', event.name)
}

/**
 * Loads all events from the specified directory
 * @param {string=} directory The directory to load the events from
 */
const register = (directory = 'events') => {
    const eventData = getEvents(directory)

    debug('Caching and registering %d events', eventData.length)

    eventData.forEach(event => {
        registerEventListener(event)
        eventCache.push(event)
    })

    debug('Cached and registered %d events', eventCache.length)
}

module.exports = {
    register,
    cache: eventCache
}
