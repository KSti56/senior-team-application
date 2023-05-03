/**
 * @author ThisLightMan <light@corebot.dev>
 * @file interactionCreate Event
 * @module events/interactionCreate
 */

const debug = require('debug')('event')
const CommandHandler = require('../handlers/CommandHandler')

module.exports = interaction => {
    debug('interactionCreate')

    if (interaction.isCommand()) {
        const command = CommandHandler.find(interaction.commandName)
        if (command) command.exec(interaction)
    }
}
