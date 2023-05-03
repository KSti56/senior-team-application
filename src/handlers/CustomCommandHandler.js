const configureMessage = require('../utils/configureMessage')
const getCaseInsensitiveProperty = require('../utils/getCaseInsensitiveProperty')
const getMessageStats = require('../utils/getMessageStats')
const getTopUsers = require('../utils/getTopUsers')

/**
 * Handles a custom command
 * @param {CommandInteraction} interaction The interaction that triggered the command
 * @param {object} customCommandConfig The custom command config
 */
module.exports = (interaction, customCommandConfig) => {
    const message = configureMessage(getCaseInsensitiveProperty(customCommandConfig, 'message'), interaction.member, [
        {
            name: 'online-users',
            value: interaction.guild.members.cache.filter(member => member.presence?.status === 'online').size
        },
        {
            name: 'total-users',
            value: interaction.guild.memberCount
        },
        {
            name: 'messages-1h',
            value: getMessageStats(interaction.guild.id, '1h')
        },
        {
            name: 'top-users-1h',
            value: getTopUsers(interaction.guild.id, '1h')
                .map((user, index) => `**${index + 1}.** <@${user[0]}> — ${user[1]} messages`)
        }
    ])

    interaction.reply(message)
}
