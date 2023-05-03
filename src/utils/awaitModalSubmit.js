/**
 * Awaits a modal submit from a member
 * @param {Interaction} interaction The interaction to await the modal submit on
 * @param {string} customId The custom ID of the modal to await the submit from
 * @returns {Promise<ModalSubmitInteraction>} The interaction from the modal submit
 */
module.exports = (interaction, customId) => {
    return new Promise((resolve, reject) => {
        const filter = i => i.user.id === interaction.member.id && i.customId === customId

        interaction.awaitModalSubmit({ filter, time: 500_000 })
            .then(resolve)
            .catch(reject)
    })
}
