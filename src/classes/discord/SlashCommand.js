/**
 * @file Slash Command Class
 * @author ThisLightMan <light@corebot.dev>
 */

const { ApplicationCommandType } = require('discord.js')
const ApplicationCommand = require('./ApplicationCommand')

module.exports = class SlashCommand extends ApplicationCommand {
    /**
     * @constructor Slash Command Class
     * @param {object} param0 Application Command Options
     * @param {string} param0.name The name of the command.
     * @param {string=} param0.description The description of the command.
     * @param {object[]=} param0.options The options of the command.
     */
    constructor ({
        name = null,
        description = 'No description provided.',
        options = []
    } = {
        name: null,
        description: 'No description provided.',
        options: []
    }) {
        super({
            name,
            description,
            type: ApplicationCommandType.ChatInput,
            options: options || []
        })
    }
}
