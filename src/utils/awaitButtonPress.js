/**
 * Awaits a button press from a member on a message
 * @param {Message} message The message to await the button press on
 * @param {GuildMember} member The member to await the button press from
 * @returns {Promise<ButtonInteraction>} The interaction from the button press
 */
module.exports = (message, member) => {
    return new Promise((resolve, reject) => {
        const filter = (interaction) => interaction.user.id === member.id && interaction.message.id === message.id && interaction.isButton()

        message.channel.awaitMessageComponent({ filter, time: 120_000 })
            .then(resolve)
            .catch(reject)
    })
}
