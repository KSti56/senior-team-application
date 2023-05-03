const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js')
const config = require('../config')
const awaitSelectMenu = require('../utils/awaitSelectMenu')
const configureMessage = require('../utils/configureMessage')

module.exports = async interaction => {
    const roleSelection = config.Join.RoleSelection

    const questions = Object.keys(roleSelection).map((question, index) => {
        const selections = Object.values(roleSelection)[index]
        return {
            question,
            selections: selections.map(selection => {
                return {
                    name: selection.Role,
                    description: selection.Description,
                    emoji: selection.Emoji
                }
            })
        }
    })

    let currentReply

    const reply = message => {
        if (currentReply) return interaction.editReply(message)
        else {
            return interaction.reply(Object.assign({}, message, { fetchReply: true })).then(msg => {
                currentReply = msg
            })
        }
    }

    const askQuestion = async index => {
        const question = questions[index]
        const selections = question.selections

        const embed = new EmbedBuilder()
            .setTitle(question.question)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setFooter({ text: `Role Selection | Question ${index + 1}/${questions.length}` })

        const menu = new StringSelectMenuBuilder()
            .setCustomId(`role-selection-${index}`)
            .setPlaceholder('Select your roles')
            .addOptions(selections.map((selection, selectionIndex) => {
                return new StringSelectMenuOptionBuilder()
                    .setLabel(selection.name)
                    .setDescription(selection.description)
                    .setEmoji(selection.emoji)
                    .setValue(`role-selection-${index}-${selectionIndex}`)
            }))
            .setMinValues(0)
            .setMaxValues(selections.length)

        const actionRow = new ActionRowBuilder().addComponents(menu)

        await reply({ embeds: [embed], components: [actionRow], ephemeral: true })

        awaitSelectMenu(currentReply, interaction.member)
            .then(async interaction => {
                interaction.deferUpdate()

                const selectedRoles = interaction.values.map(value => {
                    const [questionIndex, selectionIndex] = value.split('-').slice(2)
                    return questions[questionIndex].selections[selectionIndex]
                })

                const rolesToAdd = selectedRoles.map(role => interaction.guild.roles.cache.find(r => r.name.toLowerCase() === role.name.toLowerCase())).filter(role => role)
                const rolesToRemove = interaction.member.roles.cache
                    .filter(role => selectedRoles.some(selectedRole => selectedRole.name.toLowerCase() === role.name.toLowerCase()))

                await interaction.member.roles.add(rolesToAdd)
                await interaction.member.roles.remove(rolesToRemove)

                if (index === questions.length - 1) {
                    return reply(Object.assign({}, { ephemeral: true }, configureMessage(config.Messages.RoleSelectionComplete, interaction.member)))
                } else {
                    return askQuestion(index + 1)
                }
            })
            .catch(err => {
                console.error(err)
                // Menu timed out
                currentReply.delete()
            })
    }

    askQuestion(0)
}
