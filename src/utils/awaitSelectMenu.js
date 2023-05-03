/**
 * Awaits a select menu press from a member on a message
 * @param {Message} message The message to await the select menu press on
 * @param {GuildMember} member The member to await the select menu press from
 * @returns {Promise<AnySelectMenuInteraction>} The interaction from the select menu press
 */
module.exports = (message, member) => {
    return new Promise((resolve, reject) => {
        const filter = interaction => interaction.user.id === member.id && interaction.message.id === message.id && interaction.isStringSelectMenu()

        message.channel.awaitMessageComponent({ filter, time: 120_000 })
            .then(resolve)
            .catch(reject)
    })
}
