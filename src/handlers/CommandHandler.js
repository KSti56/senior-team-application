/**
 * @file Command Handler
 * @author ThisLightMan <light@corebot.dev>
 */

const fs = require('fs')
const path = require('path')
const Command = require('../classes/Command')
const debug = require('debug')('command-handler')
const config = require('../config')

const commandCache = new Map()

const index = require('../')
const getCaseInsensitiveProperty = require('../utils/getCaseInsensitiveProperty')
const CustomCommandHandler = require('./CustomCommandHandler')

/**
 * Finds and registers all command files in the specified directory
 * @param {string} directory The directory to load the commands from
 * @returns {Command[]} An array of command classes
 */
const getCommands = (directory = 'commands') => {
    const directoryPath = path.join(__dirname, '../', directory)

    debug('Loading commands from %s', directoryPath)

    const fileNames = fs.readdirSync(directoryPath)
        .filter(file => file.endsWith('.js'))

    debug('Found %d files', fileNames.length)

    const commandFiles = fileNames.map(file => {
        const commandPath = path.join(directoryPath, file)
        const command = require(commandPath)

        if (command instanceof Command) {
            debug('Found command %s', command.name)
            return command
        } else {
            debug('Found non-command file %s', file)
            return null
        }
    })
        .filter(cmd => cmd)

    debug('Returned %d commands', commandFiles.length)

    return commandFiles
}

/**
 * Registers a slash command with Discord
 * @param {object} command The command to register
 */
const registerSlashCommand = (command) => {
    return new Promise((resolve, reject) => {
        debug('Registering slash command %s', command.name)

        index.client.application.commands.create(command)
            .then(() => {
                debug('Registered slash command %s', command.name)

                resolve(command)
            })
            .catch(err => {
                debug('Failed to register slash command %s', command.name)
                debug(err)

                reject(err)
            })
    })
}

/**
 * Gets all custom commands from the config
 * @returns {object[]} An array of custom command objects
 */
const getCustomCommands = () => {
    const customCommands = config.CustomCommands

    return customCommands.map(command =>
        new Command({
            name: getCaseInsensitiveProperty(command, 'name'),
            description: getCaseInsensitiveProperty(command, 'description'),
            options: [],
            exec: (interaction) => CustomCommandHandler(interaction, command)
        })
    )
}

/**
 * Loads all commands from the specified directory
 * @param {string=} directory The directory to load the commands from
 */
const register = (directory = 'commands') => {
    const commandData = [...getCommands(directory), ...getCustomCommands()]

    debug('Caching and registering %d commands', commandData.length)

    commandData.forEach(command => {
        try {
            registerSlashCommand(command.getDiscordData())

            commandCache.set(command.name.toLowerCase(), command)
        } catch (err) {
            debug('Failed to register command %s', command.name)
            debug(err)
        }
    })

    debug('Cached and registered %d commands', commandCache.size)
}

/**
 * Finds a command by name
 * @param {string} name The name of the command to find
 * @returns {Command} The command object
 */
const find = (name) => {
    return commandCache.get(name.toLowerCase())
}

module.exports = {
    register,
    find,
    cache: commandCache
}
