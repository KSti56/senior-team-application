/**
 * @file Slash Command Class
 * @author ThisLightMan <light@corebot.dev>
 */

const { ApplicationCommandType } = require('discord.js')
const ApplicationCommand = require('./ApplicationCommand')

module.exports = class SlashCommand extends ApplicationCommand {
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
