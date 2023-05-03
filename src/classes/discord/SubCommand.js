/**
 * @file Sub Command Class
 * @author ThisLightMan <light@corebot.dev>
 */

const { ApplicationCommandOptionType } = require('discord.js')

module.exports = class SubCommand {
    constructor ({
        name = null,
        description = 'No description provided.',
        options = []
    }) {
        this.name = name
        this.description = description
        this.options = options
    }

    formatData () {
        return {
            type: ApplicationCommandOptionType.Subcommand,
            name: this.name,
            description: this.description,
            options: this.options
        }
    }
}
