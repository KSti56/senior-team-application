/**
 * @author ThisLightMan <light@corebot.dev>
 * @file Class to handle context menus, slash commands, etc. (all classified under application commands)
 * @module classes/discord/ApplicationCommand
 */

const { ApplicationCommandType } = require('discord.js')

module.exports = class ApplicationCommand {
    /**
     * @constructor Application Command Class
     * @param {object} param0 Application Command Options
     * @param {string} param0.name The name of the command.
     * @param {string} param0.description The description of the command.
     * @param {object[]} param0.options The options of the command.
     * @param {ApplicationCommandType} param0.type The type of the command.
     */
    constructor ({
        name = null,
        description = 'No description provided.',
        options = [],
        type = ApplicationCommandType.ChatInput
    }) {
        this.name = name
        this.description = description
        this.options = options
        this.type = type
    }

    /**
     * Format the command data for the Discord API
     * @returns {object} The Discord API command data
     */
    formatData () {
        return {
            type: this.type,
            name: this.name,
            description: this.description,
            options: this.options.map(option => option.getDiscordData())
        }
    }
}
